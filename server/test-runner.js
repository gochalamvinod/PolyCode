import './config/loadEnv.js';
import axios from 'axios';
import { validateTargetSyntax } from './services/validatorService.js';
import { buildConversionPrompt } from './services/promptService.js';
import { Conversion } from './models/Conversion.js';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';

const BASE_URL = 'http://localhost:5000/api/v1';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${testName}`);
    passedCount++;
  } else {
    console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${testName} ${details ? `(${details})` : ''}`);
    failedCount++;
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log(`  POLYCODE COMPREHENSIVE TEST SUITE     `);
  console.log(`========================================${colors.reset}\n`);

  await connectDB();

  const uniqueSuffix = Date.now();
  let userAToken = '';
  let userBToken = '';
  let userAId = '';
  let userBId = '';
  let createdProjectId = '';

  // ----------------------------------------------------
  // TEST GROUP 1: Health & System Diagnostics
  // ----------------------------------------------------
  console.log(`${colors.yellow}[1] Health & Language API Diagnostics${colors.reset}`);
  try {
    const healthRes = await axios.get(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
    assert(healthRes.data?.data?.status === 'healthy', 'System status is "healthy"');
    assert(healthRes.data?.data?.database?.status === 'connected', 'MongoDB database reports "connected"');
    assert(healthRes.data?.data?.aiProvider?.provider === 'gemini', 'AI Provider is identified as configured provider');

    const langRes = await axios.get(`${BASE_URL}/languages`);
    assert(langRes.status === 200, 'Languages endpoint responds with HTTP 200');
    assert(langRes.data?.data?.count === 5, 'Exact 5 supported languages returned');
    const ids = langRes.data?.data?.languages.map(l => l.id);
    assert(
      ids.includes('python') && ids.includes('java') && ids.includes('javascript') && ids.includes('c') && ids.includes('cpp'),
      'Languages include Python, Java, JavaScript, C, and C++'
    );
  } catch (err) {
    assert(false, 'Health & Language Diagnostics failed', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 2: Authentication & User Accounts
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[2] Authentication & Security Suite${colors.reset}`);
  try {
    // 2.1 Register User A
    const userAEmail = `devA_${uniqueSuffix}@polycode.dev`;
    const regResA = await axios.post(`${BASE_URL}/auth/register`, {
      username: `alex_dev_${uniqueSuffix}`,
      email: userAEmail,
      password: 'SecurePassword123!',
      preferredSourceLanguage: 'java',
      preferredTargetLanguage: 'python'
    });
    assert(regResA.status === 201, 'User A registered with HTTP 201');
    assert(regResA.data?.data?.token, 'JWT Token generated on registration');
    assert(!regResA.data?.data?.user?.password, 'Password hash is NOT exposed in response');
    userAToken = regResA.data.data.token;
    userAId = regResA.data.data.user._id;

    // 2.2 Duplicate email rejection
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: `alex_clone`,
        email: userAEmail,
        password: 'AnotherPassword123!'
      });
      assert(false, 'Duplicate registration should fail');
    } catch (dupErr) {
      assert(dupErr.response?.status === 409, 'Duplicate email rejected with HTTP 409 Conflict');
    }

    // 2.3 Short password rejection (Zod validator)
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: `short_pwd_user`,
        email: `short_${uniqueSuffix}@polycode.dev`,
        password: '123'
      });
      assert(false, 'Short password should fail validation');
    } catch (shortErr) {
      assert(shortErr.response?.status === 400, 'Password < 6 chars rejected with HTTP 400');
    }

    // 2.4 Login with invalid password
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: userAEmail,
        password: 'WrongPassword999'
      });
      assert(false, 'Invalid password should fail login');
    } catch (badPwErr) {
      assert(badPwErr.response?.status === 401, 'Invalid password rejected with HTTP 401 Unauthorized');
    }

    // 2.5 Successful Login
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: userAEmail,
      password: 'SecurePassword123!'
    });
    assert(loginRes.status === 200, 'User A successfully logged in with HTTP 200');
    assert(loginRes.data?.data?.user?.email === userAEmail.toLowerCase(), 'User profile returned on login matches');

    // 2.6 Authenticated Profile Retrieval (/auth/me)
    const meRes = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(meRes.status === 200, 'GET /auth/me returns 200 for authenticated user');
    assert(meRes.data?.data?.user?.username === `alex_dev_${uniqueSuffix}`, 'Profile username matches User A');

    // 2.7 Update Profile Preferences
    const updateRes = await axios.put(
      `${BASE_URL}/auth/me`,
      { preferredSourceLanguage: 'cpp', theme: 'light' },
      { headers: { Authorization: `Bearer ${userAToken}` } }
    );
    assert(updateRes.data?.data?.user?.preferredSourceLanguage === 'cpp', 'Preferred source language updated to "cpp"');
    assert(updateRes.data?.data?.user?.theme === 'light', 'Theme preference updated to "light"');

    // 2.8 Register User B for Isolation Tests
    const userBEmail = `devB_${uniqueSuffix}@polycode.dev`;
    const regResB = await axios.post(`${BASE_URL}/auth/register`, {
      username: `blake_dev_${uniqueSuffix}`,
      email: userBEmail,
      password: 'SecurePassword456!'
    });
    userBToken = regResB.data.data.token;
    userBId = regResB.data.data.user._id;
    assert(Boolean(userBToken && userBId !== userAId), 'User B registered for privacy/isolation tests');
  } catch (err) {
    assert(false, 'Authentication suite encountered an unhandled error', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 3: Request Validation & Error Guards
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[3] Conversion Request Validation & Constraints${colors.reset}`);
  try {
    // 3.1 Empty code submission
    try {
      await axios.post(`${BASE_URL}/conversions`, {
        sourceLanguage: 'python',
        targetLanguage: 'javascript',
        sourceCode: '   '
      });
      assert(false, 'Empty sourceCode should be rejected');
    } catch (emptyErr) {
      assert(emptyErr.response?.status === 400, 'Empty sourceCode rejected with HTTP 400');
    }

    // 3.2 Identical source and target languages
    try {
      await axios.post(`${BASE_URL}/conversions`, {
        sourceLanguage: 'python',
        targetLanguage: 'python',
        sourceCode: 'print("hello world")'
      });
      assert(false, 'Identical languages should be rejected');
    } catch (sameLangErr) {
      assert(sameLangErr.response?.status === 400, 'Identical source & target languages rejected with HTTP 400');
    }

    // 3.3 Unsupported source language
    try {
      await axios.post(`${BASE_URL}/conversions`, {
        sourceLanguage: 'fortran',
        targetLanguage: 'python',
        sourceCode: 'PROGRAM HELLO'
      });
      assert(false, 'Unsupported language should be rejected');
    } catch (unsuppErr) {
      assert(unsuppErr.response?.status === 400, 'Unsupported language rejected with HTTP 400');
    }

    // 3.4 Missing AI API key error behavior (Section 2 & 5 requirement)
    try {
      await axios.post(`${BASE_URL}/conversions`, {
        sourceLanguage: 'python',
        targetLanguage: 'java',
        sourceCode: 'def greet(name):\n    return f"Hello, {name}!"'
      });
      assert(false, 'Conversion without key should not succeed');
    } catch (noKeyErr) {
      assert(noKeyErr.response?.status === 503, 'Unconfigured AI key returns HTTP 503 Service Unavailable');
      assert(noKeyErr.response?.data?.error?.code === 'AI_PROVIDER_NOT_CONFIGURED', 'Clear error code "AI_PROVIDER_NOT_CONFIGURED"');
      assert(Boolean(noKeyErr.response?.data?.error?.details?.instructions), 'Provides clear setup instructions for .env configuration');
    }

    // 3.5 Oversized input code limit check
    const oversizedCode = 'x = 1;\n'.repeat(60000); // Exceeds 50,000 characters
    try {
      await axios.post(`${BASE_URL}/conversions`, {
        sourceLanguage: 'python',
        targetLanguage: 'javascript',
        sourceCode: oversizedCode
      });
      assert(false, 'Oversized code should be rejected');
    } catch (overErr) {
      assert(overErr.response?.status === 400, 'Code > 50,000 characters rejected with HTTP 400');
    }
  } catch (err) {
    assert(false, 'Conversion validation test encountered an unexpected error', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 4: Heuristic Syntax Validation Unit Tests
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[4] Heuristic Target Syntax Validator Unit Tests${colors.reset}`);
  try {
    // 4.1 Valid balanced code
    const balancedCode = `function test(a, b) { if (a > b) { return [a, b]; } return null; }`;
    const check1 = validateTargetSyntax(balancedCode, 'javascript');
    assert(check1.isValid === true && check1.warnings.length === 0, 'Clean balanced JavaScript passes syntax validation');

    // 4.2 Unbalanced delimiters (missing closing brace)
    const unbalancedCode = `public class Main { public static void main(String[] args) { System.out.println("test"); }`;
    const check2 = validateTargetSyntax(unbalancedCode, 'java');
    assert(check2.isValid === false, 'Unclosed delimiter properly identified');
    assert(check2.warnings.some(w => w.includes('Unclosed delimiter')), 'Warning reported for missing delimiter');

    // 4.3 Brackets inside strings and comments should not trigger false syntax errors
    const stringBracketsCode = `def test():\n    # Note: this bracket [ is inside a comment\n    s = "Bracket { inside string } should not fail"\n    return s`;
    const check3 = validateTargetSyntax(stringBracketsCode, 'python');
    assert(check3.isValid === true, 'Delimiters inside quotes and comments are correctly ignored');

    // 4.4 C/C++ missing header heuristic
    const cCodeNoHeader = `int main() { printf("Hello"); return 0; }`;
    const check4 = validateTargetSyntax(cCodeNoHeader, 'c');
    assert(check4.warnings.some(w => w.includes('<stdio.h>')), 'Missing standard header warning triggered for C code');
  } catch (err) {
    assert(false, 'Syntax validator tests encountered an error', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 5: Prompt Construction Unit Tests
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[5] Conversion Prompt Construction Unit Tests${colors.reset}`);
  try {
    const promptData = buildConversionPrompt({
      sourceLanguage: 'java',
      targetLanguage: 'python',
      sourceCode: 'public class Calc { public int add(int a, int b) { return a + b; } }',
      settings: {
        conversionStyle: 'preserve_structure',
        conversionDetail: 'with_explanations',
        codePreferences: 'preserve_algorithm',
        addComments: true
      },
      additionalInstructions: 'Use type hinting where possible.'
    });

    assert(promptData.systemPrompt.includes('You are PolyCode'), 'System prompt contains PolyCode persona');
    assert(promptData.systemPrompt.includes('Preserve the original algorithm'), 'System prompt includes algorithm preservation rule');
    assert(promptData.userPrompt.includes('Target Language Guidelines for Python'), 'User prompt injects target language instructions');
    assert(promptData.userPrompt.includes('Preserve line-by-line structure'), 'Conversion style settings properly injected');
    assert(promptData.userPrompt.includes('Use type hinting where possible.'), 'Additional user instructions properly injected');
  } catch (err) {
    assert(false, 'Prompt service tests failed', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 6: Saved Projects CRUD & Multi-User Isolation
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[6] Saved Projects CRUD & Security Isolation Suite${colors.reset}`);
  try {
    // 6.1 Create Project for User A
    const createProjRes = await axios.post(
      `${BASE_URL}/projects`,
      {
        title: 'Binary Search Implementation',
        description: 'Binary search converted from C++ to Python',
        sourceLanguage: 'cpp',
        targetLanguage: 'python',
        sourceCode: 'int binarySearch(int arr[], int l, int r, int x) { ... }',
        convertedCode: 'def binary_search(arr, l, r, x): ...',
        summary: 'Converted iterative binary search',
        tags: ['algorithms', 'search', 'binary-search']
      },
      { headers: { Authorization: `Bearer ${userAToken}` } }
    );
    assert(createProjRes.status === 201, 'Project created with HTTP 201');
    createdProjectId = createProjRes.data?.data?.project?._id;
    assert(Boolean(createdProjectId), 'Project ID generated');

    // 6.2 Get Projects for User A
    const listProjResA = await axios.get(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(listProjResA.data?.data?.projects?.length >= 1, 'User A can retrieve their saved projects');
    assert(listProjResA.data?.data?.projects[0]?.title === 'Binary Search Implementation', 'Project title matches');

    // 6.3 Privacy Isolation: User B cannot retrieve User A's project
    try {
      await axios.get(`${BASE_URL}/projects/${createdProjectId}`, {
        headers: { Authorization: `Bearer ${userBToken}` }
      });
      assert(false, 'User B should NOT be able to view User A\'s project');
    } catch (isolErr) {
      assert(isolErr.response?.status === 403, 'Cross-user access denied with HTTP 403 Forbidden');
    }

    // 6.4 Privacy Isolation: User B cannot modify User A's project
    try {
      await axios.put(
        `${BASE_URL}/projects/${createdProjectId}`,
        { title: 'Hacked Title' },
        { headers: { Authorization: `Bearer ${userBToken}` } }
      );
      assert(false, 'User B should NOT be able to update User A\'s project');
    } catch (updErr) {
      assert(updErr.response?.status === 403, 'Cross-user modification denied with HTTP 403 Forbidden');
    }

    // 6.5 Update Project by Owner (User A)
    const updateProjRes = await axios.put(
      `${BASE_URL}/projects/${createdProjectId}`,
      { title: 'Updated Binary Search (Optimal)' },
      { headers: { Authorization: `Bearer ${userAToken}` } }
    );
    assert(updateProjRes.data?.data?.project?.title === 'Updated Binary Search (Optimal)', 'Owner can update project title');

    // 6.6 Delete Project by Owner (User A)
    const delProjRes = await axios.delete(`${BASE_URL}/projects/${createdProjectId}`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(delProjRes.status === 200, 'Owner can delete project (HTTP 200)');
  } catch (err) {
    assert(false, 'Projects suite encountered an error', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 7: Conversion History Persistence & Pagination
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[7] Conversion History Persistence & Direct DB Layer${colors.reset}`);
  try {
    // Insert test conversion directly via Mongoose model for User A
    const testConv = await Conversion.create({
      userId: userAId,
      sourceLanguage: 'java',
      targetLanguage: 'python',
      sourceCode: 'System.out.println("PolyCode Test");',
      convertedCode: 'print("PolyCode Test")',
      summary: 'Console print conversion',
      explanation: ['System.out.println mapped to print()'],
      warnings: [],
      assumptions: [],
      confidence: 'high',
      conversionStatus: 'completed'
    });
    assert(Boolean(testConv._id), 'Direct conversion entry created for User A');

    // Retrieve via API
    const histRes = await axios.get(`${BASE_URL}/conversions?sourceLanguage=java`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert(histRes.status === 200, 'History retrieved with HTTP 200');
    assert(histRes.data?.data?.conversions?.length >= 1, 'History filter by sourceLanguage works');
    assert(histRes.data?.data?.pagination?.currentPage === 1, 'Pagination current page is 1');

    // Cleanup conversion
    await Conversion.findByIdAndDelete(testConv._id);
    assert(true, 'Test conversion entry cleaned up');
  } catch (err) {
    assert(false, 'History test encountered an error', err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 8: Static Client Frontend Serving
  // ----------------------------------------------------
  console.log(`\n${colors.yellow}[8] Frontend SPA Production Serving via Express${colors.reset}`);
  try {
    const clientRes = await axios.get('http://localhost:5000/');
    assert(clientRes.status === 200, 'Express serves index.html on root path');
    assert(clientRes.data.includes('<title>PolyCode'), 'SPA title contains "PolyCode"');
    assert(clientRes.data.includes('<div id="root"></div>'), 'Root DOM node present in SPA');
    assert(clientRes.data.includes('/assets/'), 'Static compiled assets referenced in HTML');
  } catch (err) {
    assert(false, 'Static frontend serving test failed', err.message);
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log(`  TEST RUN RESULTS                      `);
  console.log(`========================================${colors.reset}`);
  console.log(`  ${colors.green}Total Passed: ${passedCount}${colors.reset}`);
  console.log(`  ${failedCount === 0 ? colors.green : colors.red}Total Failed: ${failedCount}${colors.reset}`);
  console.log(`  Total Asserts: ${passedCount + failedCount}`);

  await mongoose.disconnect();

  if (failedCount === 0) {
    console.log(`\n  ${colors.bold}${colors.green}🎉 ALL TESTS PASSED SUCCESSFULLY!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n  ${colors.bold}${colors.red}❌ SOME TESTS FAILED.${colors.reset}\n`);
    process.exit(1);
  }
}

runTests();

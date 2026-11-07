/**
 * PolyCode Conversion Benchmark & Latency Measurement Script
 * Evaluates 5 sample programs across 4 target languages with 3 runs per pair.
 * Run with: node scripts/measure-conversion.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api/v1';

// 5 Sample Programs (~50 to 200 lines each)
const samplePrograms = [
  {
    name: 'LRU_Cache',
    sourceLanguage: 'javascript',
    code: `class DNode {
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DNode();
    this.tail = new DNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    node.next = this.head.next;
    node.next.prev = node;
    node.prev = this.head;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
    }
    const node = new DNode(key, value);
    this._add(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}

// Verification driver
const cache = new LRUCache(2);
cache.put(1, 10);
cache.put(2, 20);
console.log(cache.get(1)); // 10
cache.put(3, 30);
console.log(cache.get(2)); // -1`
  },
  {
    name: 'Binary_Search_Tree',
    sourceLanguage: 'javascript',
    code: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (true) {
      if (val === current.val) return undefined;
      if (val < current.val) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  find(val) {
    if (!this.root) return false;
    let current = this.root;
    while (current) {
      if (val < current.val) current = current.left;
      else if (val > current.val) current = current.right;
      else return true;
    }
    return false;
  }

  inOrderTraversal(node = this.root, result = []) {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.val);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }
}

const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
console.log(bst.inOrderTraversal());`
  },
  {
    name: 'Sorting_Algorithms',
    sourceLanguage: 'javascript',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pIndex = partition(arr, low, high);
    quickSort(arr, low, pIndex - 1);
    quickSort(arr, pIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

const data = [64, 34, 25, 12, 22, 11, 90];
console.log('Merge:', mergeSort([...data]));
console.log('Quick:', quickSort([...data]));`
  },
  {
    name: 'Trie_Route_Matcher',
    sourceLanguage: 'javascript',
    code: `class TrieNode {
  constructor() {
    this.children = new Map();
    this.handler = null;
    this.paramName = null;
  }
}

class TrieRouter {
  constructor() {
    this.root = new TrieNode();
  }

  addRoute(path, handler) {
    const segments = path.split('/').filter(Boolean);
    let current = this.root;
    for (const seg of segments) {
      if (seg.startsWith(':')) {
        if (!current.children.has(':param')) {
          const node = new TrieNode();
          node.paramName = seg.slice(1);
          current.children.set(':param', node);
        }
        current = current.children.get(':param');
      } else {
        if (!current.children.has(seg)) {
          current.children.set(seg, new TrieNode());
        }
        current = current.children.get(seg);
      }
    }
    current.handler = handler;
  }

  match(path) {
    const segments = path.split('/').filter(Boolean);
    const params = {};
    let current = this.root;
    for (const seg of segments) {
      if (current.children.has(seg)) {
        current = current.children.get(seg);
      } else if (current.children.has(':param')) {
        current = current.children.get(':param');
        params[current.paramName] = seg;
      } else {
        return null;
      }
    }
    return current.handler ? { handler: current.handler, params } : null;
  }
}

const router = new TrieRouter();
router.addRoute('/users/:id', (p) => 'User ' + p.id);
console.log(router.match('/users/42'));`
  },
  {
    name: 'CSV_Parser_Serializer',
    sourceLanguage: 'javascript',
    code: `class SimpleCSV {
  static parse(csvText, delimiter = ',') {
    const lines = csvText.trim().split('\\n');
    if (lines.length === 0) return [];
    const headers = lines[0].split(delimiter).map(h => h.trim());
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map(c => c.trim());
      if (row.length === headers.length) {
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx];
        });
        records.push(obj);
      }
    }
    return records;
  }

  static stringify(records, delimiter = ',') {
    if (!records || records.length === 0) return '';
    const headers = Object.keys(records[0]);
    const lines = [headers.join(delimiter)];
    for (const rec of records) {
      const row = headers.map(h => rec[h] !== undefined ? rec[h] : '');
      lines.push(row.join(delimiter));
    }
    return lines.join('\\n');
  }
}

const csv = 'id,name,role\\n1,Alice,Dev\\n2,Bob,QA';
const parsed = SimpleCSV.parse(csv);
console.log(parsed);
console.log(SimpleCSV.stringify(parsed));`
  }
];

const targetLanguages = ['python', 'java', 'cpp', 'javascript'];

async function measure() {
  console.log('================================================================');
  console.log('       PolyCode AI Conversion Latency Benchmark Harness         ');
  console.log('================================================================\n');

  // Check health and AI key configuration
  let aiConfigured = false;
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    console.log('Server Health Status:', data.data?.status || 'Unknown');
    console.log('AI Provider:', data.data?.aiProvider?.provider || 'Unknown');
    aiConfigured = Boolean(data.data?.aiProvider?.hasKey);
  } catch (err) {
    console.log('Note: Backend server at localhost:5000 is not running.');
  }

  const measurementsFile = path.resolve(__dirname, '..', 'docs', 'MEASUREMENTS.md');
  const docsDir = path.dirname(measurementsFile);
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  if (!aiConfigured) {
    console.log('\n[Measurement Note] No AI API Key is configured in environment.');
    console.log('AI conversion latency: not measured');
    console.log('Writing docs/MEASUREMENTS.md with manual baseline placeholders.\n');

    const markdownContent = `# PolyCode Conversion Latency & Accuracy Measurements

## Benchmark Setup
- **Sample Programs:** 5 programs (50–200 lines each)
  1. LRU Cache
  2. Binary Search Tree
  3. Sorting Algorithms (MergeSort & QuickSort)
  4. Trie Route Matcher
  5. Simple CSV Parser & Serializer
- **Target Languages Tested:** Python, Java, C++, JavaScript
- **Repeated Runs:** 3 iterations per pair

---

## Latency Measurements

| Program | Target Language | Runs | Median Latency | P95 Latency | Success Rate | Manual Baseline |
|---|---|---|---|---|---|---|
| LRU_Cache | Python | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| LRU_Cache | Java | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| LRU_Cache | C++ | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Binary_Search_Tree | Python | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Binary_Search_Tree | Java | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Binary_Search_Tree | C++ | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Sorting_Algorithms | Python | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Sorting_Algorithms | Java | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Sorting_Algorithms | C++ | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Trie_Route_Matcher | Python | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Trie_Route_Matcher | Java | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| Trie_Route_Matcher | C++ | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| CSV_Parser | Python | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| CSV_Parser | Java | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |
| CSV_Parser | C++ | 3 | *not measured* | *not measured* | *not measured* | [MANUAL_PORTING_BASELINE_TIME_PLACEHOLDER] |

> **Note on Manual Baseline:** Manual translation times will be timed by hand using a stopwatch across each sample and filled in above. Do not invent manual numbers.
`;
    fs.writeFileSync(measurementsFile, markdownContent, 'utf8');
    console.log(`Saved measurements template to: ${measurementsFile}`);
    return;
  }
}

measure();

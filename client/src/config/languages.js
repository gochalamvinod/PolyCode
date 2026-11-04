export const SUPPORTED_LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    monacoId: 'python',
    extension: '.py',
    tag: 'PEP 8',
    color: '#3776ab',
    capabilities: ['Classes', 'Functions', 'Async/Await', 'List Comprehensions'],
    instructions: 'Follow PEP 8 conventions. Use snake_case, standard library data structures, and idiomatic Python.',
    sampleCode: `def fibonacci_series(n):\n    """Generate Fibonacci series up to n elements."""\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    \n    series = [0, 1]\n    for i in range(2, n):\n        next_val = series[-1] + series[-2]\n        series.append(next_val)\n    return series\n\n# Test execution\ncount = 10\nresult = fibonacci_series(count)\nprint(f"Fibonacci series of {count} numbers: {result}")\n`
  },
  {
    id: 'java',
    name: 'Java',
    monacoId: 'java',
    extension: '.java',
    tag: 'OOP',
    color: '#f89820',
    capabilities: ['Classes', 'Interfaces', 'Generics', 'Exceptions', 'Streams'],
    instructions: 'Encapsulate within public classes. Strongly typed, camelCase methods and PascalCase classes.',
    sampleCode: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class Fibonacci {\n    public static List<Integer> getFibonacciSeries(int n) {\n        List<Integer> series = new ArrayList<>();\n        if (n <= 0) return series;\n        \n        series.add(0);\n        if (n == 1) return series;\n        \n        series.add(1);\n        for (int i = 2; i < n; i++) {\n            int nextVal = series.get(i - 1) + series.get(i - 2);\n            series.add(nextVal);\n        }\n        return series;\n    }\n\n    public static void main(String[] args) {\n        int count = 10;\n        List<Integer> result = getFibonacciSeries(count);\n        System.out.println("Fibonacci series of " + count + " numbers: " + result);\n    }\n}\n`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    monacoId: 'javascript',
    extension: '.js',
    tag: 'ES6+',
    color: '#f7df1e',
    capabilities: ['Closures', 'Promises', 'Async/Await', 'Prototypes', 'ES6 Classes'],
    instructions: 'Use ES6+ const/let, arrow functions, template literals, and standard modern JS patterns.',
    sampleCode: `function fibonacciSeries(n) {\n  if (n <= 0) return [];\n  if (n === 1) return [0];\n\n  const series = [0, 1];\n  for (let i = 2; i < n; i++) {\n    series.push(series[i - 1] + series[i - 2]);\n  }\n  return series;\n}\n\n// Test execution\nconst count = 10;\nconst result = fibonacciSeries(count);\nconsole.log(\`Fibonacci series of \${count} numbers:\`, result);\n`
  },
  {
    id: 'c',
    name: 'C',
    monacoId: 'c',
    extension: '.c',
    tag: 'Procedural',
    color: '#555555',
    capabilities: ['Pointers', 'Manual Memory', 'Structs', 'Macros'],
    instructions: 'Standard C with stdio.h, stdlib.h. Explicit pointer handling, dynamic memory management, and main().',
    sampleCode: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid printFibonacci(int n) {\n    if (n <= 0) return;\n    \n    int *series = (int *)malloc(n * sizeof(int));\n    if (series == NULL) {\n        fprintf(stderr, "Memory allocation error\\n");\n        return;\n    }\n    \n    series[0] = 0;\n    if (n > 1) series[1] = 1;\n    \n    for (int i = 2; i < n; i++) {\n        series[i] = series[i - 1] + series[i - 2];\n    }\n    \n    printf("Fibonacci series of %d numbers: [", n);\n    for (int i = 0; i < n; i++) {\n        printf("%d%s", series[i], (i == n - 1) ? "" : ", ");\n    }\n    printf("]\\n");\n    \n    free(series);\n}\n\nint main() {\n    int count = 10;\n    printFibonacci(count);\n    return 0;\n}\n`
  },
  {
    id: 'cpp',
    name: 'C++',
    monacoId: 'cpp',
    extension: '.cpp',
    tag: 'Modern STL',
    color: '#00599c',
    capabilities: ['STL Containers', 'Templates', 'RAII', 'Classes', 'Smart Pointers'],
    instructions: 'Use modern C++ STL (std::vector, std::string) over raw pointers, proper headers and namespaces.',
    sampleCode: `#include <iostream>\n#include <vector>\n\nstd::vector<int> getFibonacciSeries(int n) {\n    std::vector<int> series;\n    if (n <= 0) return series;\n    \n    series.push_back(0);\n    if (n == 1) return series;\n    \n    series.push_back(1);\n    for (int i = 2; i < n; ++i) {\n        series.push_back(series[i - 1] + series[i - 2]);\n    }\n    return series;\n}\n\nint main() {\n    int count = 10;\n    std::vector<int> result = getFibonacciSeries(count);\n    std::cout << "Fibonacci series of " << count << " numbers: [";\n    for (size_t i = 0; i < result.size(); ++i) {\n        std::cout << result[i] << (i + 1 == result.size() ? "" : ", ");\n    }\n    std::cout << "]\\n";\n    return 0;\n}\n`
  }
];

export const getLanguageById = (id) => {
  if (!id) return SUPPORTED_LANGUAGES[0];
  return SUPPORTED_LANGUAGES.find((lang) => lang.id.toLowerCase() === id.toLowerCase()) || SUPPORTED_LANGUAGES[0];
};

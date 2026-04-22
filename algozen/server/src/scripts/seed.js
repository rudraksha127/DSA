import 'dotenv/config'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'

const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const problems = [
  // ─── Arrays ───────────────────────────────────────────────────────
  {
    title: 'Two Sum',
    slug:  'two-sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers that add up to \`target\`.

**Input format:**
- Line 1: n (size of array)
- Line 2: n space-separated integers
- Line 3: target

**Output format:** Two space-separated indices (0-based), smaller index first.`,
    track:         'DSA',
    topic:         'Arrays',
    difficulty:    'Rookie',
    levelRequired: 1,
    xpReward:      50,
    isPOTD:        true,
    constraints:   '2 ≤ n ≤ 10^4, -10^9 ≤ nums[i] ≤ 10^9, exactly one solution exists',
    hints: [
      'Think about using a hash map to store numbers you have already seen.',
      'For each number, check if (target - number) exists in the map.',
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9',  output: '0 1', explanation: '2+7=9' },
      { input: '3\n3 2 4\n6',      output: '1 2', explanation: '2+4=6' },
      { input: '2\n3 3\n6',        output: '0 1', explanation: '3+3=6', isHidden: true },
      { input: '5\n1 5 3 7 2\n8',  output: '1 4', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target; cin >> target;

    // Your solution here

    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // Your solution here
    }
}`,
      python: `import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const nums = lines[1].split(' ').map(Number);
const target = parseInt(lines[2]);

// Your solution here`,
    },
  },

  {
    title: 'Maximum Subarray',
    slug:  'maximum-subarray',
    description: `Given an integer array \`nums\`, find the contiguous subarray with the **largest sum** and return its sum.

**Input format:**
- Line 1: n
- Line 2: n space-separated integers

**Output:** A single integer — the maximum subarray sum.`,
    track:         'DSA',
    topic:         'Arrays',
    difficulty:    'Rookie',
    levelRequired: 1,
    xpReward:      75,
    constraints:   '1 ≤ n ≤ 10^5, -10^4 ≤ nums[i] ≤ 10^4',
    hints: [
      "Kadane's algorithm: keep a running sum and reset to 0 when it goes negative.",
      'Track both the current sum and the global maximum.',
    ],
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4\n', output: '6',  explanation: '[4,-1,2,1] has sum 6' },
      { input: '1\n1\n',                        output: '1' },
      { input: '5\n-2 -1 -3 -4 -1\n',          output: '-1' },
      { input: '8\n5 4 -1 7 8 -2 3 -5\n',      output: '24', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Your solution here

    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // Your solution here
    }
}`,
      python: `import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().split()))

# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const nums = lines[1].trim().split(' ').map(Number);

// Your solution here`,
    },
  },

  {
    title: 'Contains Duplicate',
    slug:  'contains-duplicate',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice**, and \`false\` if every element is distinct.

**Input:**
- Line 1: n
- Line 2: n space-separated integers

**Output:** \`true\` or \`false\``,
    track:         'DSA',
    topic:         'Arrays',
    difficulty:    'Rookie',
    levelRequired: 1,
    xpReward:      40,
    constraints:   '1 ≤ n ≤ 10^5, -10^9 ≤ nums[i] ≤ 10^9',
    hints: [
      'Use a hash set to track numbers you have already seen.',
    ],
    testCases: [
      { input: '4\n1 2 3 1',    output: 'true' },
      { input: '4\n1 2 3 4',    output: 'false' },
      { input: '5\n1 1 1 3 3',  output: 'true' },
      { input: '3\n-1 0 1',     output: 'false', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Your solution here

    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // Your solution here
    }
}`,
      python: `import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().split()))

# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const nums = lines[1].split(' ').map(Number);

// Your solution here`,
    },
  },

  // ─── Strings ─────────────────────────────────────────────────────
  {
    title: 'Valid Palindrome',
    slug:  'valid-palindrome',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

**Input:** A single line string.
**Output:** \`true\` or \`false\``,
    track:         'DSA',
    topic:         'Strings',
    difficulty:    'Rookie',
    levelRequired: 1,
    xpReward:      50,
    constraints:   '1 ≤ s.length ≤ 2×10^5',
    hints: [
      'Strip non-alphanumeric characters and convert to lowercase first.',
      'Use two pointers from both ends.',
    ],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', output: 'true' },
      { input: 'race a car',                     output: 'false' },
      { input: ' ',                               output: 'true' },
      { input: 'No lemon, no melon',              output: 'true', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    // Your solution here

    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();

        // Your solution here
    }
}`,
      python: `s = input()

# Your solution here`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

// Your solution here`,
    },
  },

  {
    title: 'Valid Anagram',
    slug:  'valid-anagram',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word formed by rearranging all letters of another word exactly once.

**Input:**
- Line 1: string s
- Line 2: string t

**Output:** \`true\` or \`false\``,
    track:         'DSA',
    topic:         'Strings',
    difficulty:    'Rookie',
    levelRequired: 1,
    xpReward:      60,
    constraints:   '1 ≤ s.length, t.length ≤ 5×10^4, strings consist of lowercase letters',
    hints: [
      'Count character frequencies and compare.',
    ],
    testCases: [
      { input: 'anagram\nnagaram', output: 'true' },
      { input: 'rat\ncar',        output: 'false' },
      { input: 'listen\nsilent',  output: 'true' },
      { input: 'abc\nabc',        output: 'true', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s, t;
    cin >> s >> t;

    // Your solution here

    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String t = sc.nextLine();

        // Your solution here
    }
}`,
      python: `s = input()
t = input()

# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const s = lines[0];
const t = lines[1];

// Your solution here`,
    },
  },

  // ─── Stack / Queue ────────────────────────────────────────────────
  {
    title: 'Valid Parentheses',
    slug:  'valid-parentheses',
    description: `Given a string \`s\` containing only the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is **valid**.

A string is valid if:
1. Open brackets are closed by the same type of bracket.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket.

**Input:** A single line string.
**Output:** \`true\` or \`false\``,
    track:         'DSA',
    topic:         'Stack',
    difficulty:    'Warrior',
    levelRequired: 3,
    xpReward:      100,
    constraints:   '1 ≤ s.length ≤ 10^4',
    hints: [
      'Use a stack. Push open brackets, pop and check when you see a closing bracket.',
    ],
    testCases: [
      { input: '()',       output: 'true' },
      { input: '()[]{',   output: 'false' },
      { input: '(]',      output: 'false' },
      { input: '{[()]}',  output: 'true', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s; cin >> s;

    // Your solution here

    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();

        // Your solution here
    }
}`,
      python: `s = input()

# Your solution here`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

// Your solution here`,
    },
  },

  {
    title: 'Min Stack',
    slug:  'min-stack',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in **O(1)** time.

For this problem, implement the operations given as a sequence of commands:
- \`push X\` — push X onto the stack
- \`pop\` — remove top element
- \`top\` — print top element
- \`getMin\` — print minimum element

**Input:** First line is n (number of operations), then n lines each with a command.
**Output:** One line per \`top\` or \`getMin\` command.`,
    track:         'DSA',
    topic:         'Stack',
    difficulty:    'Warrior',
    levelRequired: 4,
    xpReward:      150,
    constraints:   '1 ≤ n ≤ 3×10^4',
    hints: [
      'Maintain a second auxiliary stack that tracks the current minimum.',
    ],
    testCases: [
      { input: '5\npush -2\npush 0\npush -3\ngetMin\npop', output: '-3' },
      { input: '3\npush 1\ntop\ngetMin', output: '1\n1' },
      { input: '6\npush 5\npush 3\npush 7\ngetMin\npop\ngetMin', output: '3\n3', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    // Your solution here
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        // Your solution here
    }
}`,
      python: `import sys
input = sys.stdin.readline

n = int(input())
# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
// Your solution here`,
    },
  },

  // ─── Trees ───────────────────────────────────────────────────────
  {
    title: 'Maximum Depth of Binary Tree',
    slug:  'maximum-depth-of-binary-tree',
    description: `Given the level-order representation of a binary tree (use \`null\` for missing nodes), return its **maximum depth** (number of nodes along the longest root-to-leaf path).

**Input:** Space-separated values in level order, e.g. \`3 9 20 null null 15 7\`
**Output:** A single integer.`,
    track:         'DSA',
    topic:         'Trees',
    difficulty:    'Warrior',
    levelRequired: 5,
    xpReward:      120,
    constraints:   '0 ≤ number of nodes ≤ 10^4',
    hints: [
      'Use recursion: depth = 1 + max(depth(left), depth(right)).',
      'Or use BFS and count levels.',
    ],
    testCases: [
      { input: '3 9 20 null null 15 7', output: '3' },
      { input: '1 null 2',              output: '2' },
      { input: 'null',                  output: '0' },
      { input: '1 2 3 4 5',             output: '3', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

// Build tree from level-order input
TreeNode* build(vector<string>& vals) {
    if (vals.empty() || vals[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(vals[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < (int)vals.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)vals.size() && vals[i] != "null") { node->left = new TreeNode(stoi(vals[i])); q.push(node->left); } i++;
        if (i < (int)vals.size() && vals[i] != "null") { node->right = new TreeNode(stoi(vals[i])); q.push(node->right); } i++;
    }
    return root;
}

int maxDepth(TreeNode* root) {
    // Your solution here
    return 0;
}

int main() {
    string line; getline(cin, line);
    istringstream iss(line);
    vector<string> vals;
    string tok; while (iss >> tok) vals.push_back(tok);
    TreeNode* root = build(vals);
    cout << maxDepth(root) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    static int maxDepth(int[] vals, int i) {
        if (i >= vals.length || vals[i] == Integer.MIN_VALUE) return 0;
        return 1 + Math.max(maxDepth(vals, 2*i+1), maxDepth(vals, 2*i+2));
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        // Your solution here
    }
}`,
      python: `from collections import deque

vals = input().split()

# Your solution here`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ');

// Your solution here`,
    },
  },

  {
    title: 'Invert Binary Tree',
    slug:  'invert-binary-tree',
    description: `Given the root of a binary tree in level-order format, invert the tree (mirror it) and output the level-order traversal of the inverted tree. Use \`null\` for missing nodes in input; omit trailing nulls in output.

**Input:** Space-separated level-order values.
**Output:** Space-separated level-order values of the inverted tree.`,
    track:         'DSA',
    topic:         'Trees',
    difficulty:    'Warrior',
    levelRequired: 5,
    xpReward:      100,
    constraints:   '0 ≤ number of nodes ≤ 100',
    hints: [
      'Recursively swap the left and right children of every node.',
    ],
    testCases: [
      { input: '4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1' },
      { input: '2 1 3',         output: '2 3 1' },
      { input: 'null',          output: 'null' },
      { input: '1 2',           output: '1 null 2', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;
// Your solution here
int main() {
    string line; getline(cin, line);
    // parse + invert + output
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        // Your solution here
    }
}`,
      python: `vals = input().split()
# Your solution here`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ');
// Your solution here`,
    },
  },

  // ─── Dynamic Programming ─────────────────────────────────────────
  {
    title: 'Climbing Stairs',
    slug:  'climbing-stairs',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can climb **1 or 2 steps**. In how many distinct ways can you climb to the top?

**Input:** A single integer n.
**Output:** A single integer.`,
    track:         'DSA',
    topic:         'DynamicProgramming',
    difficulty:    'Warrior',
    levelRequired: 3,
    xpReward:      150,
    constraints:   '1 ≤ n ≤ 45',
    hints: [
      'Notice that ways(n) = ways(n-1) + ways(n-2). Sound familiar?',
      "It's essentially Fibonacci!",
    ],
    testCases: [
      { input: '2', output: '2' },
      { input: '3', output: '3' },
      { input: '5', output: '8' },
      { input: '10', output: '89', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    // Your solution here
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Your solution here
    }
}`,
      python: `n = int(input())
# Your solution here`,
      javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());
// Your solution here`,
    },
  },

  {
    title: 'Coin Change',
    slug:  'coin-change',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\`. Return the **fewest number of coins** needed to make up that amount. If it cannot be done, return \`-1\`.

**Input:**
- Line 1: n (number of coin types)
- Line 2: n space-separated coin values
- Line 3: amount

**Output:** Minimum number of coins, or \`-1\`.`,
    track:         'DSA',
    topic:         'DynamicProgramming',
    difficulty:    'Legend',
    levelRequired: 8,
    xpReward:      300,
    constraints:   '1 ≤ n ≤ 12, 1 ≤ coins[i] ≤ 2^31-1, 0 ≤ amount ≤ 10^4',
    hints: [
      'Use bottom-up DP: dp[i] = min coins to make amount i.',
      'Initialize dp[0]=0, rest to infinity.',
    ],
    testCases: [
      { input: '3\n1 5 11\n15', output: '3' },
      { input: '2\n2\n3',       output: '-1' },
      { input: '1\n1\n0',       output: '0' },
      { input: '3\n1 2 5\n11',  output: '3', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];
    int amount; cin >> amount;
    // Your solution here
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();
        // Your solution here
    }
}`,
      python: `import sys
input = sys.stdin.readline

n = int(input())
coins = list(map(int, input().split()))
amount = int(input())
# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const coins = lines[1].split(' ').map(Number);
const amount = parseInt(lines[2]);
// Your solution here`,
    },
  },

  {
    title: 'Longest Common Subsequence',
    slug:  'longest-common-subsequence',
    description: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**. If there is no common subsequence, return 0.

A **subsequence** of a string is generated by deleting some characters without changing the relative order of the remaining characters.

**Input:**
- Line 1: text1
- Line 2: text2

**Output:** A single integer.`,
    track:         'DSA',
    topic:         'DynamicProgramming',
    difficulty:    'Legend',
    levelRequired: 10,
    xpReward:      350,
    constraints:   '1 ≤ text1.length, text2.length ≤ 1000, strings consist of lowercase English letters',
    hints: [
      'Classic 2D DP: dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1].',
      'If text1[i-1]==text2[j-1], dp[i][j] = dp[i-1][j-1]+1, else max(dp[i-1][j], dp[i][j-1]).',
    ],
    testCases: [
      { input: 'abcde\nace',     output: '3' },
      { input: 'abc\nabc',       output: '3' },
      { input: 'abc\ndef',       output: '0' },
      { input: 'oxcpqrsvwf\nshmtulqrypy', output: '2', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string text1, text2;
    cin >> text1 >> text2;
    // Your solution here
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String text1 = sc.nextLine();
        String text2 = sc.nextLine();
        // Your solution here
    }
}`,
      python: `text1 = input()
text2 = input()
# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const text1 = lines[0];
const text2 = lines[1];
// Your solution here`,
    },
  },

  // ─── Graphs ──────────────────────────────────────────────────────
  {
    title: 'Number of Islands',
    slug:  'number-of-islands',
    description: `Given an \`m x n\` 2D binary grid of \`'1'\`s (land) and \`'0'\`s (water), return the **number of islands**.

An island is surrounded by water and is formed by connecting adjacent (4-directional) land cells.

**Input:**
- Line 1: m n
- Next m lines: n space-separated characters ('1' or '0')

**Output:** A single integer.`,
    track:         'DSA',
    topic:         'Graphs',
    difficulty:    'Legend',
    levelRequired: 9,
    xpReward:      300,
    constraints:   '1 ≤ m, n ≤ 300',
    hints: [
      'Use BFS or DFS: when you find a \'1\', flood-fill it and count it as one island.',
    ],
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3' },
      { input: '1 1\n0',                                           output: '0' },
      { input: '3 3\n1 0 1\n0 1 0\n1 0 1',                        output: '5', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int m, n; cin >> m >> n;
    vector<vector<char>> grid(m, vector<char>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) { char c; cin >> c; grid[i][j] = c; }
    // Your solution here
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        char[][] grid = new char[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) grid[i][j] = sc.next().charAt(0);
        // Your solution here
    }
}`,
      python: `import sys
input = sys.stdin.readline

m, n = map(int, input().split())
grid = [input().split() for _ in range(m)]
# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const [m, n] = lines[0].split(' ').map(Number);
const grid = lines.slice(1).map(l => l.split(' '));
// Your solution here`,
    },
  },

  {
    title: 'Clone Graph',
    slug:  'clone-graph',
    description: `Given a reference of a node in a **connected undirected graph**, return a **deep copy** (clone) of the graph.

The graph is given in adjacency list format:
- Line 1: n (number of nodes, values 1..n)
- Next n lines: comma-separated neighbors of node i (or empty line if no neighbors)

Output the adjacency list of the cloned graph (same format).`,
    track:         'DSA',
    topic:         'Graphs',
    difficulty:    'Legend',
    levelRequired: 10,
    xpReward:      350,
    constraints:   '0 ≤ n ≤ 100, 1 ≤ Node.val ≤ 100',
    hints: [
      'Use a hash map from old node → new node to avoid infinite recursion.',
      'BFS or DFS both work.',
    ],
    testCases: [
      { input: '4\n2,4\n1,3\n2,4\n1,3', output: '2,4\n1,3\n2,4\n1,3' },
      { input: '1\n',                   output: '' },
      { input: '2\n2\n1',               output: '2\n1' },
      { input: '3\n2,3\n1,3\n1,2',      output: '2,3\n1,3\n1,2', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;
// Your solution here
int main() {
    // parse adjacency list, clone, and output
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        // Your solution here
    }
}`,
      python: `import sys
lines = sys.stdin.read().splitlines()
# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
// Your solution here`,
    },
  },

  // ─── RealWorld ───────────────────────────────────────────────────
  {
    title: 'Design Rate Limiter',
    slug:  'design-rate-limiter',
    description: `Design a **rate limiter** that restricts users to at most \`K\` requests per \`W\` seconds using the **sliding window log** algorithm.

Given a sequence of timestamped requests, output \`ALLOW\` or \`DENY\` for each.

**Input:**
- Line 1: K W (max requests, window in seconds)
- Line 2: n (number of requests)
- Next n lines: userId timestamp (integer seconds)

**Output:** n lines, each \`ALLOW\` or \`DENY\``,
    track:         'RealWorld',
    topic:         'SystemDesign',
    difficulty:    'Legend',
    levelRequired: 12,
    xpReward:      400,
    constraints:   '1 ≤ K ≤ 100, 1 ≤ W ≤ 3600, 1 ≤ n ≤ 10^4',
    hints: [
      'For each user, maintain a sorted list of timestamps of allowed requests.',
      'Remove timestamps older than (current - W) before checking.',
    ],
    testCases: [
      {
        input:  '3 10\n5\nuser1 1\nuser1 2\nuser1 3\nuser1 4\nuser1 11',
        output: 'ALLOW\nALLOW\nALLOW\nDENY\nALLOW',
      },
      {
        input:  '2 5\n3\nA 1\nA 3\nA 5',
        output: 'ALLOW\nALLOW\nDENY',
      },
      {
        input:  '1 1\n2\nX 0\nX 1',
        output: 'ALLOW\nALLOW',
      },
      {
        input:  '2 3\n4\nA 1\nB 1\nA 2\nA 4',
        output: 'ALLOW\nALLOW\nALLOW\nALLOW',
        isHidden: true,
      },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int K, W; cin >> K >> W;
    int n; cin >> n;
    map<string, deque<int>> logs;
    // Your solution here
    return 0;
}`,
      java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int K = sc.nextInt(), W = sc.nextInt();
        int n = sc.nextInt();
        Map<String, Deque<Integer>> logs = new HashMap<>();
        // Your solution here
    }
}`,
      python: `import sys
from collections import defaultdict, deque
input = sys.stdin.readline

K, W = map(int, input().split())
n = int(input())
logs = defaultdict(deque)
# Your solution here`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const [K, W] = lines[0].split(' ').map(Number);
const n = parseInt(lines[1]);
const logs = new Map();
// Your solution here`,
    },
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🍃 MongoDB connected')

    await Problem.deleteMany({})
    console.log('🗑️  Cleared existing problems')

    for (const p of problems) {
      await Problem.create(p)
      console.log(`✅ Seeded: ${p.title}`)
    }

    console.log(`\n🎉 Seeded ${problems.length} problems successfully!`)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('👋 Disconnected from MongoDB')
    process.exit(0)
  }
}

seed()

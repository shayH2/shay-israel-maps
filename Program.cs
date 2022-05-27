using System;

namespace StringMatch
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            int firstMatchIndex = FindMatch("abaababaabababbbabbba", "abab");

            Console.WriteLine($"{nameof(firstMatchIndex)}: {firstMatchIndex}");
        }

        public static int FindMatch(string heystack, string needle)
        {
            int differentLettersCountInPrefix;
            int differentLettersCountInSufffix;

            var hs = heystack?.ToCharArray();

            var ndl = needle?.ToCharArray();

            int index = 0;

            bool foundDifference = false;

            while (!foundDifference && index < ndl.Length)
            {
                foundDifference = index > 0 && ndl[index - 1] == ndl[index];

                if (!foundDifference)
                    index++;
            }

            differentLettersCountInPrefix = index;

            index = ndl.Length - 1;

            foundDifference = false;

            while (!foundDifference && index >= 0)
            {
                foundDifference = (index < ndl.Length - 1) && ndl[index] == ndl[index + 1];

                if (!foundDifference)
                    index--;
            }

            differentLettersCountInSufffix = ndl.Length - 1 - index;

            int length = heystack.Length - needle.Length;

            int? firstMatchIndex = null;

            index = 0;

            while (!firstMatchIndex.HasValue && index < length)
            {
                bool foundDifferenceLeft = false;
                bool foundDifferenceRight = false;

                int left = 0;
                int right = needle.Length - 1;

                while ((!foundDifferenceLeft || !foundDifferenceRight) &&
                    left <= right)
                {
                    int leftHeystack = index + left;
                    int rightHeystack = index + right;

                    bool firstIteration = (right - left) >= ndl.Length - 1;

                    if (firstIteration || !foundDifferenceLeft)
                        foundDifferenceLeft = hs[leftHeystack] != ndl[left++];

                    if (firstIteration || !foundDifferenceRight)
                        foundDifferenceRight = hs[rightHeystack] != ndl[right--];
                }

                if (!foundDifferenceLeft && !foundDifferenceRight)
                    firstMatchIndex = index;

                index += Math.Min(left, differentLettersCountInPrefix);
            }

            return firstMatchIndex ?? -1;
        }
    }
}

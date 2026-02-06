// Decision Making (if-else & switch) & Recursion
// ---------------------------------------------

// ========== Decision Making ==========

/**
 * Leap Year Checker
 * Leap years: divisible by 4, but not by 100 unless also divisible by 400.
 */
function isLeapYear(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}

/**
 * Ticket Pricing
 * Children (age <= 12): $10
 * Teenagers (age 13-17): $15
 * Adults (age >= 18): $20
 */
function getTicketPrice(age) {
  if (age <= 12) return 10;
  if (age <= 17) return 15;
  return 20;
}

/**
 * Weather Clothing Adviser
 * Advises based on temperature and whether it's raining.
 */
function adviseClothing(temperatureCelsius, isRaining) {
  let advice = [];

  if (isRaining) {
    advice.push("Take an umbrella or raincoat.");
  }

  if (temperatureCelsius < 0) {
    advice.push("Wear a heavy coat, scarf, gloves, and warm boots.");
  } else if (temperatureCelsius < 10) {
    advice.push("Wear a warm coat and layers.");
  } else if (temperatureCelsius < 20) {
    advice.push("A light jacket or sweater is recommended.");
  } else if (temperatureCelsius < 30) {
    advice.push("Light clothing is fine (t-shirt, shorts optional).");
  } else {
    advice.push("Wear light, breathable clothing and stay hydrated.");
  }

  return advice.join(" ");
}

// ========== Recursion ==========

/**
 * Fibonacci Sequence (recursive)
 * F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)
 */
function fib(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

/**
 * Palindrome Checker (recursive)
 * Ignores spaces, punctuation, and capitalization.
 */
function isPalindrome(str) {
  const cleaned = str.replace(/[\s\p{P}]/gu, "").toLowerCase();
  if (cleaned.length <= 1) return true;
  if (cleaned[0] !== cleaned[cleaned.length - 1]) return false;
  return isPalindrome(cleaned.slice(1, -1));
}

/**
 * Power Function (recursive)
 * base^exponent, with exponent as non-negative integer.
 */
function power(base, exponent) {
  if (exponent === 0) return 1;
  if (exponent === 1) return base;
  return base * power(base, exponent - 1);
}

// ========== Demo ==========

function runDemo() {
  console.log("=== Decision Making ===\n");

  console.log("Leap Year:");
  console.log("  2024:", isLeapYear(2024));
  console.log("  1900:", isLeapYear(1900));
  console.log("  2000:", isLeapYear(2000));

  console.log("\nTicket Pricing:");
  console.log("  Age 10:", "$" + getTicketPrice(10));
  console.log("  Age 15:", "$" + getTicketPrice(15));
  console.log("  Age 25:", "$" + getTicketPrice(25));

  console.log("\nWeather Clothing Adviser:");
  console.log("  5°C, raining:", adviseClothing(5, true));
  console.log("  25°C, sunny:", adviseClothing(25, false));

  console.log("\n=== Recursion ===\n");

  console.log("Fibonacci (n=0..8):", [0, 1, 2, 3, 4, 5, 6, 7, 8].map(fib));

  console.log("\nPalindrome Checker:");
  console.log("  'racecar':", isPalindrome("racecar"));
  console.log("  'A man a plan a canal Panama':", isPalindrome("A man a plan a canal Panama"));
  console.log("  'hello':", isPalindrome("hello"));

  console.log("\nPower Function:");
  console.log("  2^10 =", power(2, 10));
  console.log("  3^4  =", power(3, 4));
}

if (require.main === module) {
  runDemo();
}

module.exports = {
  isLeapYear,
  getTicketPrice,
  adviseClothing,
  fib,
  isPalindrome,
  power,
};

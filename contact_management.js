// ---------- Core Data Structures ----------

class Contact {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }

  toString() {
    return `${this.name} - ${this.phone}`;
  }
}

class Node {
  constructor(contact) {
    this.contact = contact;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(contact) {
    const newNode = new Node(contact);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  *iterForward() {
    let current = this.head;
    while (current) {
      yield current.contact;
      current = current.next;
    }
  }

  *iterBackward() {
    let current = this.tail;
    while (current) {
      yield current.contact;
      current = current.prev;
    }
  }
}

// ---------- String Matching ----------

function naiveSubstringSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return true;
  if (m > n) return false;

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) return true;
  }

  return false;
}

// ---------- Contact Manager ----------

class ContactManager {
  constructor() {
    this.list = new DoublyLinkedList();
    this.byName = new Map(); // hash table
  }

  addContact(name, phone) {
    const contact = new Contact(name, phone);
    this.list.append(contact);
    this.byName.set(name, contact); // last one wins on duplicate names
  }

  searchByKeyword(keyword) {
    const keywordLower = keyword.toLowerCase();
    const results = [];
    for (const contact of this.list.iterForward()) {
      if (naiveSubstringSearch(contact.name.toLowerCase(), keywordLower)) {
        results.push(contact);
      }
    }
    return results;
  }

  searchByName(name) {
    return this.byName.get(name) || null;
  }

  getAllForward() {
    return Array.from(this.list.iterForward());
  }

  getAllBackward() {
    return Array.from(this.list.iterBackward());
  }
}

// ---------- CLI Interface ----------

function printMenu() {
  console.log();
  console.log("1. Add Contact");
  console.log("2. Search by Keyword");
  console.log("3. Search by Exact Name");
  console.log("4. View All (Forward)");
  console.log("5. View All (Backward)");
  console.log("6. Exit");
  console.log();
}

function runCli() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const manager = new ContactManager();

  function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
  }

  async function loop() {
    while (true) {
      printMenu();
      const option = (await ask("Enter option: ")).trim();

      if (option === "1") {
        const name = (await ask("\nName: ")).trim();
        const phone = (await ask("Phone: ")).trim();
        if (!name || !phone) {
          console.log("Name and phone cannot be empty.");
          continue;
        }
        manager.addContact(name, phone);
        console.log("\nContact added.");
      } else if (option === "2") {
        const keyword = (await ask("\nSearch keyword: ")).trim();
        const matches = manager.searchByKeyword(keyword);
        if (matches.length === 0) {
          console.log("No matches found.");
        } else {
          for (const c of matches) {
            console.log(`Match found: ${c.toString()}`);
          }
        }
      } else if (option === "3") {
        const name = (await ask("\nExact name: ")).trim();
        const contact = manager.searchByName(name);
        if (!contact) {
          console.log("No contact found with that exact name.");
        } else {
          console.log(`Found: ${contact.toString()}`);
        }
      } else if (option === "4") {
        console.log("\nContacts (Forward):");
        const contacts = manager.getAllForward();
        if (contacts.length === 0) {
          console.log("No contacts to display.");
        } else {
          for (const c of contacts) {
            console.log(c.toString());
          }
        }
      } else if (option === "5") {
        console.log("\nContacts (Backward):");
        const contacts = manager.getAllBackward();
        if (contacts.length === 0) {
          console.log("No contacts to display.");
        } else {
          for (const c of contacts) {
            console.log(c.toString());
          }
        }
      } else if (option === "6") {
        console.log("\nGoodbye!");
        rl.close();
        break;
      } else {
        console.log("Invalid option. Please enter a number between 1 and 6.");
      }
    }
  }

  loop().catch((err) => {
    console.error("Unexpected error:", err);
    rl.close();
  });
}

if (require.main === module) {
  runCli();
}


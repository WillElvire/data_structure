// Simple FIFO Queue using an array
class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(element) {
      this.items.push(element);
    }
  
    dequeue() {
      if (this.isEmpty()) {
        console.log("Queue is empty. No job to process.");
        return null;
      }
      return this.items.shift();
    }
  
    peek() {
      if (this.isEmpty()) return null;
      return this.items[0];
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    size() {
      return this.items.length;
    }
  
    toArray() {
      return [...this.items];
    }
  }
  
  // PrinterQueue using the Queue
  class PrinterQueue {
    constructor() {
      this.queue = new Queue();
    }
  
    // job: { name: string, pages: number }
    addJob(name, pages) {
      const job = { name, pages };
      this.queue.enqueue(job);
      console.log(`Added job: ${name} (${pages} pages)`);
    }
  
    processNextJob() {
      const job = this.queue.dequeue();
      if (!job) return;
      console.log(`Processing job: ${job.name} (${job.pages} pages)`);
      // Simulate printing...
    }
  
    printQueue() {
      if (this.queue.isEmpty()) {
        console.log("Printer queue is empty.");
        return;
      }
      console.log("Current printer queue:");
      this.queue.toArray().forEach((job, index) => {
        console.log(`${index + 1}. ${job.name} - ${job.pages} pages`);
      });
    }
  
    isEmpty() {
      return this.queue.isEmpty();
    }
  }
  
  // ---- Test / Demo ----
  function runDemo() {
    const printer = new PrinterQueue();
  
    printer.addJob("Report_Q1", 10);
    printer.addJob("Presentation", 5);
    printer.addJob("Invoice_123", 2);
  
    printer.printQueue();
  
    console.log("\nProcessing jobs...");
    printer.processNextJob();
    printer.printQueue();
  
    printer.processNextJob();
    printer.processNextJob();
    printer.processNextJob(); // extra call: queue already empty
  }
  
  runDemo();
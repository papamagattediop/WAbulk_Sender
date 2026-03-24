export class SendQueue {
  constructor({ delay = 4000, maxRetry = 2 } = {}) {
    this.delay    = delay;
    this.maxRetry = maxRetry;
  }

  async run(contacts, template, sendFn, onProgress) {
    const report = { sent: 0, failed: 0, errors: [] };

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const message = personalize(template, contact);
      let   success = false;

      for (let attempt = 1; attempt <= this.maxRetry; attempt++) {
        try {
          await sendFn(contact.numero, message);
          success = true;
          break;
        } catch (e) {
          if (attempt < this.maxRetry) await sleep(2000);
          else {
            report.errors.push({ contact: contact.nom, numero: contact.numero, error: e.message });
          }
        }
      }

      if (success) {
        report.sent++;
        onProgress({ type: "progress", index: i + 1, total: contacts.length, contact: contact.nom, numero: contact.numero, status: "sent" });
        console.log(`✅ [${i + 1}/${contacts.length}] ${contact.nom}`);
      } else {
        report.failed++;
        onProgress({ type: "progress", index: i + 1, total: contacts.length, contact: contact.nom, numero: contact.numero, status: "failed" });
        console.log(`❌ [${i + 1}/${contacts.length}] ${contact.nom}`);
      }

      // Délai aléatoire anti-ban (sauf dernier)
      if (i < contacts.length - 1) {
        await sleep(this.delay + Math.floor(Math.random() * 2000));
      }
    }

    return report;
  }
}

const personalize = (template, contact) => {
  let msg = template;
  for (const [key, value] of Object.entries(contact)) {
    msg = msg.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return msg;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
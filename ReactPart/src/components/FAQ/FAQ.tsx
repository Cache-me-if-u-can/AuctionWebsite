import React, { useState } from "react";
import styles from "./FAQ.module.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  title: string;
  questions: FAQItem[];
}

interface FAQData {
  [key: string]: FAQSection;
}

const faqData: FAQData = {
  general: {
    title: "General Questions",
    questions: [
      {
        q: "How does charity auction bidding work?",
        a: "Our platform allows you to bid on items with proceeds going to charity. Place bids on items you're interested in, and if you have the highest bid when the auction ends, you win the item. A significant portion of the proceeds goes to the charity associated with the item.",
      },
      {
        q: "How do I know if a charity is legitimate?",
        a: "All charities on our platform are verified organizations. We conduct thorough background checks and require proper documentation before allowing charities to participate in our auctions.",
      },
      {
        q: "What happens if I win an auction?",
        a: "When you win an auction, you'll receive an email notification with payment instructions. Once payment is completed, shipping arrangements will be made for your item.",
      },
    ],
  },
  bidding: {
    title: "Bidding & Payments",
    questions: [
      {
        q: "How do I place a bid?",
        a: "To place a bid, simply navigate to the auction item you're interested in and enter your bid amount. The system will notify you if you've been outbid.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
      },
      {
        q: "Can I cancel a bid?",
        a: "Bids are generally final and cannot be cancelled. Please bid carefully and ensure you're willing to pay the amount you bid.",
      },
    ],
  },
  // ... other sections as provided in the data structure
};

const FAQ: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      {Object.entries(faqData).map(([sectionKey, section]) => (
        <div key={sectionKey} className={styles.section}>
          <div className={styles.sectionTitle}>
            <h2>{section.title}</h2>
          </div>
          <Accordion allowZeroExpanded>
            {section.questions.map((item, index) => (
              <AccordionItem key={`${sectionKey}-${index}`}>
                <AccordionItemHeading>
                  <AccordionItemButton>{item.q}</AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <p>{item.a}</p>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default FAQ;

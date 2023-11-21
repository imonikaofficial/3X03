import React from 'react';
import { Layout, Collapse } from 'antd';

const { Content, Footer } = Layout;
const { Panel } = Collapse;

const faqData = [
  {
    question: 'What types of cars do you offer?',
    answer: 'We offer a wide selection of cars, including economy, midsize, and luxury vehicles. You can view our catalog for more details.',
  },
  {
    question: 'Is there a minimum age requirement to rent a car?',
    answer: 'Yes, the minimum age for renting a car is 18 years old, and you must have a valid driver\'s license.',
  },
  {
    question: 'What are your rental rates?',
    answer: 'Our rental rates vary depending on the car model, rental duration, and additional services. You can find pricing details on our website.',
  },
  {
    question: 'What documents do I need for car rental?',
    answer: 'To rent a car, you will typically need a valid driver\'s license and a credit card for the security deposit. Please check our rental policy for specific requirements.',
  },
  {
    question: 'Where can i submit my driver\'s license verfication request?',
    answer: 'You will have to register for an account first and verify your email. Thereafter, you will be able to submit your driver\'s license verfication request under Profile > Upload License.',
  },
];

const FAQ = () => {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <Collapse accordion>
        {faqData.map((faq, index) => (
          <Panel header={faq.question} key={index}>
            <p>{faq.answer}</p>
          </Panel>
        ))}
      </Collapse>
    </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>


    
  );
};

export default FAQ;

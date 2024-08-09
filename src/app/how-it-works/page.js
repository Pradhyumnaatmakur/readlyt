"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBookOpen,
  faCog,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const HowItWorks = () => {
  const cards = [
    {
      title: "Discover Readlyt",
      content:
        "Readlyt is your gateway to reading faster and more effectively. Train your brain to focus on one word at a time and see your reading speed and comprehension soar.",
      icon: faBookOpen,
    },
    {
      title: "How It Transforms Your Reading",
      content:
        "Paste any text into Readlyt and experience the magic of single-word display. Say goodbye to distractions and hello to efficient reading.",
      icon: faCog,
    },
    {
      title: "Why Choose Readlyt ?",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Enhance career opportunities with improved reading speed.</li>
          <li>Study smarter, not harder, and excel in exams.</li>
          <li>Manage information overload with ease.</li>
          <li>Save valuable time for what truly matters.</li>
        </ul>
      ),
      icon: faChartLine,
    },
    {
      title: "Customizable for Your Needs",
      content:
        "Adjust font size, reading speed, and more to tailor Readlyt to your personal reading preferences.",
      icon: faBolt,
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col items-center p-4 font-sans pt-24">
        {" "}
        {/* Adjusted padding-top */}
        <section className="max-w-4xl w-full mx-auto flex flex-col items-center">
          <header className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Revolutionize Your Reading with Readlyt
            </h1>
            <p className="mt-2 text-lg">
              Join millions who have unlocked their full reading potential with
              Readlyt. Embrace the future of reading and see results in no time!
            </p>
          </header>
          <div className="w-full max-w-2xl mx-auto">
            {cards.map((card, index) => (
              <article
                key={index}
                className="bg-neutral-800 p-6 rounded-lg shadow-lg mb-8"
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="text-green-500 text-4xl mb-4 block mx-auto"
                />
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
                  {card.title}
                </h2>
                <div className="text-base sm:text-lg mb-4 text-center">
                  {card.content}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default HowItWorks;

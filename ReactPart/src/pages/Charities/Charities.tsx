import React from "react";
import styles from "./Charities.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Charity from "../../components/Charity/Charity";
//!TODO: Get these from the db instead
const charities = [
  {
    name: "Charity One",
    location: "Country, City",
    charityId: 1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices erat et ipsum pretium volutpat. Etiam tempus at odio id luctus. Nunc nec ornare leo, in placerat libero. Aenean risus mi, posuere sed leo a, gravida feugiat orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In id sem felis. Nam sagittis interdum lectus, eget imperdiet velit viverra sit amet. Fusce suscipit et sapien vitae consequat. Curabitur faucibus, erat non mollis mattis, mauris erat auctor dui, id gravida urna erat tincidunt nibh.",
    logo: "https://clipground.com/images/placeholder-logo-5.png",
  },
  {
    name: "Charity Two",
    location: "Country, City",
    charityId: 2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices erat et ipsum pretium volutpat. Etiam tempus at odio id luctus. Nunc nec ornare leo, in placerat libero. Aenean risus mi, posuere sed leo a, gravida feugiat orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In id sem felis. Nam sagittis interdum lectus, eget imperdiet velit viverra sit amet. Fusce suscipit et sapien vitae consequat. Curabitur faucibus, erat non mollis mattis, mauris erat auctor dui, id gravida urna erat tincidunt nibh.",
    logo: "https://clipground.com/images/placeholder-logo-5.png",
  },
  {
    name: "Charity Three",
    charityId: 3,
    location: "Country, City",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices erat et ipsum pretium volutpat. Etiam tempus at odio id luctus. Nunc nec ornare leo, in placerat libero. Aenean risus mi, posuere sed leo a, gravida feugiat orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In id sem felis. Nam sagittis interdum lectus, eget imperdiet velit viverra sit amet. Fusce suscipit et sapien vitae consequat. Curabitur faucibus, erat non mollis mattis, mauris erat auctor dui, id gravida urna erat tincidunt nibh.",
    logo: "https://clipground.com/images/placeholder-logo-5.png",
  },
  {
    name: "Charity Four",
    location: "Country, City",
    charityId: 4,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultrices erat et ipsum pretium volutpat. Etiam tempus at odio id luctus. Nunc nec ornare leo, in placerat libero. Aenean risus mi, posuere sed leo a, gravida feugiat orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In id sem felis. Nam sagittis interdum lectus, eget imperdiet velit viverra sit amet. Fusce suscipit et sapien vitae consequat. Curabitur faucibus, erat non mollis mattis, mauris erat auctor dui, id gravida urna erat tincidunt nibh.",
    logo: "https://clipground.com/images/placeholder-logo-5.png",
  },
  // Add more charity objects as needed
];
export default function Charities() {
  return (
    <>
      <Header />
      <div className={styles.charityList}>
        {charities.map((charity, index) => (
          <Charity
            key={charity.charityId}
            name={charity.name}
            location={charity.location}
            description={charity.description}
            logo={charity.logo}
            index={index}
          />
        ))}
      </div>
      <Footer />{" "}
    </>
  );
}

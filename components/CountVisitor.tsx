"use client";
import { useEffect } from "react";

const CountVisitor = () => {
  const sendVisitedRequest = async () => {
    try {
      const response = await fetch("/api/visitor", {
        method: "POST",
      });
      if (response.ok) {
        console.log("Visitor count updated successfully");
      } else {
        console.log("Error updating visitor count");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    sendVisitedRequest();
  }, []);

  return null;
};

export default CountVisitor;

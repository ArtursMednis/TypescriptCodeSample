import { ReactNode } from "react";

export default function Card(props: {
    [x: string]: ReactNode;
  }) {

    return (
      <div style={{ 
        display: "block", 
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        border: "1px solid rgba(0, 0, 0, 0.25)",

      margin:5,
      padding:4 }}>
          {props.children}
      </div>
    );
  }
  
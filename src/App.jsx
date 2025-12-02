import { useState } from "react";

export default function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  const handleEqual = () => {
    if (expression.trim() === "") {
      setResult("Error");
      return;
    }

    try {
      const output = eval(expression);

      if (output === Infinity || output === -Infinity) {
        setResult("Infinity");
      } else if (Number.isNaN(output)) {
        setResult("NaN");
      } else {
        setResult(output);
      }
    } catch {
      setResult("Error");
    }
  };

  const buttons = [
    "7", "8", "9", "+",
    "4", "5", "6", "-",
    "1", "2", "3", "*",
    "C", "0", "=", "/"
  ];

  return (
    <div style={{
      textAlign: "center",
      background: "#1e293b",
      minHeight: "100vh",
      paddingTop: "40px",
      color: "white"
    }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
        React Calculator
      </h1>

      <input
        type="text"
        value={expression}
        readOnly
        style={{
          marginTop: "20px",
          width: "250px",
          height: "28px",
          padding: "5px 10px",
          fontSize: "16px"
        }}
      />

      <div style={{
        marginTop: "15px",
        height: "25px",
        fontSize: "22px"
      }}>
        {result}
      </div>

      <div style={{
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 80px)",
        gap: "18px",
        justifyContent: "center"
      }}>
        {buttons.map((btn, index) => (
          <button
            key={index}
            style={{
              padding: "18px",
              fontSize: "20px",
              background: "#d1d5db",
              borderRadius: "10px",
              border: "2px solid black",
              cursor: "pointer"
            }}
            onClick={() => {
              if (btn === "C") handleClear();
              else if (btn === "=") handleEqual();
              else handleClick(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

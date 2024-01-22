import React, { useEffect } from "react";

const ResultsBar = (props) => {
  const { completed, text, setResultsOpacity, resultsOpacity } = props;

  useEffect(() => {
    setResultsOpacity(1);
  }, [setResultsOpacity]);

  const fillerStyles = {
    width: `${completed}%`,
  };

  return (
    <div
      className="container"
      style={{
        opacity: resultsOpacity,
      }}
    >
      <div className="results-bar" style={fillerStyles}></div>
      <div className="results-text">
        <span className="result">{text}</span>
        <span className="result-percentage">{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ResultsBar;

//boilerplate code
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";

const StyledButton = styled(Button)`
  background-color: ${(props) => (props.isactive ? "#fff" : "transparent")};
  border: 2px solid #fff;
  padding: 16px 24px;
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.isactive ? "#000" : "#fff")};
  flex: 0 1 auto;

  &:hover {
    color: ${(props) => (props.isactive ? "#000" : "#000")};
    background-color: ${(props) => (props.isactive ? "#fff" : "#fff")};
  }

  // @media (max-width: 768px) {
  //   padding: 4px 8px;
  //   font-size: 12px;
  // }
`;

const HomePage = () => {
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Initialize the variable on mount and on resize
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  return (
    <div className="home">
      <div className="wrapper">
        <header className="playground-header">
          {/* <span className="title">Smurf site</span> */}
        </header>
        <div className="content">
          <Link to="/playground">
            <StyledButton variant="contained" color="primary">
              Playground
            </StyledButton>
          </Link>
          <span className="desc">
            Upload an image, slap on a Smurf hat, and swipe a blue filter to
            smurfify your look. <br />
            Save and share your creation with a tap!
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

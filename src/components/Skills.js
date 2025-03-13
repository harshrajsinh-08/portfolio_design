import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../assets/img/color-sharp.png"
import TrackVisibility from 'react-on-screen';
import './skills.css';  // We'll create this CSS file next

// Technology logos
import javaLogo from "../assets/img/skills/java.svg";
import cppLogo from "../assets/img/skills/cpp.svg";
import nodejsLogo from "../assets/img/skills/nodejs.svg";
import expressLogo from "../assets/img/skills/express.svg";
import nextjsLogo from "../assets/img/skills/nextjs.svg";
import mongodbLogo from "../assets/img/skills/mongodb.svg";
import postgresqlLogo from "../assets/img/skills/postgresql.svg";
import sqlLogo from "../assets/img/skills/sql.svg";
import webdevLogo from "../assets/img/skills/webdev.svg";

export const Skills = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if animation has played before
    const hasPlayed = localStorage.getItem('skillsAnimated');
    if (hasPlayed) {
      setHasAnimated(true);
      return;
    }
  }, []);

  const handleVisibilityChange = (isVisible) => {
    if (isVisible && !hasAnimated) {
      localStorage.setItem('skillsAnimated', 'true');
      setHasAnimated(true);
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <Container>
            <Row>
                <Col>
                    <TrackVisibility>
                      {({ isVisible }) => {
                        handleVisibilityChange(isVisible);
                        return (
                          <div className={`skill-bx ${isVisible && !hasAnimated ? "animate__animated animate__fadeIn" : ""}`}>
                            <h2>Skills</h2>
                            <p>
                              Passionate about full-stack development, I specialize in building 
                              scalable applications using modern frameworks and databases. From 
                              crafting sleek front-end UIs to optimizing back-end logic, 
                              I love tackling real-world problems with clean and efficient code.
                            </p>
                            <Carousel 
                              responsive={responsive} 
                              infinite={true} 
                              className="owl-carousel owl-theme skill-slider"
                              autoPlay={true}
                              autoPlaySpeed={3000}
                              removeArrowOnDeviceType={["tablet", "mobile"]}
                            >
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={webdevLogo} alt="Web Development" />
                                    </div>
                                    <h5>Web Development</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={javaLogo} alt="Java" />
                                    </div>
                                    <h5>Java</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={cppLogo} alt="C++" />
                                    </div>
                                    <h5>C++</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={nodejsLogo} alt="Node.js" />
                                    </div>
                                    <h5>Node.js</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={expressLogo} alt="Express.js" />
                                    </div>
                                    <h5>Express.js</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={nextjsLogo} alt="Next.js" />
                                    </div>
                                    <h5>Next.js</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={mongodbLogo} alt="MongoDB" />
                                    </div>
                                    <h5>MongoDB</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={postgresqlLogo} alt="PostgreSQL" />
                                    </div>
                                    <h5>PostgreSQL</h5>
                                </div>
                                <div className="skill-item">
                                    <div className="skill-icon">
                                        <img src={sqlLogo} alt="SQL" />
                                    </div>
                                    <h5>SQL</h5>
                                </div>
                            </Carousel>
                          </div>
                        );
                      }}
                    </TrackVisibility>
                </Col>
            </Row>
        </Container>
        <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  )
}
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { useState, useEffect } from "react";

export const Projects = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if animation has played before
    const hasPlayed = localStorage.getItem('projectsAnimated');
    if (hasPlayed) {
      setHasAnimated(true);
      return;
    }
  }, []);

  const handleVisibilityChange = (isVisible) => {
    if (isVisible && !hasAnimated) {
      localStorage.setItem('projectsAnimated', 'true');
      setHasAnimated(true);
    }
  };

  const projects = [
    {
      title: "Css Generator",
      description: "Web Development & Design",
      imgUrl: projImg1,
      projectUrl: "https://cssgenerate.vercel.app"
    },
    {
      title: "Travel Tales",
      description: "Tourism and Travel",
      imgUrl: projImg2,
      projectUrl: "https://traveltalesvit.vercel.app/"
    },
    {
      title: "Black Crest AI",
      description: "Web Development",
      imgUrl: projImg3,
      projectUrl: "https://black-crest-ai.vercel.app/"
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => {
                handleVisibilityChange(isVisible);
                return (
                  <div className={isVisible && !hasAnimated ? "animate__animated animate__fadeIn": ""}>
                    <h2>Projects</h2>
                    <p>Some of my Projects</p>
                    <Tab.Container id="projects-tabs" defaultActiveKey="first">
                      {/* <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                        <Nav.Item>
                          <Nav.Link eventKey="first">Tab 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="second">Tab 2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="third">Tab 3</Nav.Link>
                        </Nav.Item>
                      </Nav> */}
                      <Tab.Content id="slideInUp" className={isVisible && !hasAnimated ? "animate__animated animate__slideInUp" : ""}>
                        <Tab.Pane eventKey="first">
                          <Row>
                            {
                              projects.map((project, index) => {
                                return (
                                  <ProjectCard
                                    key={index}
                                    {...project}
                                    />
                                )
                              })
                            }
                          </Row>
                        </Tab.Pane>
                        {/* <Tab.Pane eventKey="section">
                          <p>second.</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="third">
                          <p>third.</p>
                        </Tab.Pane> */}
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                );
              }}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="Background"></img>
    </section>
  )
}

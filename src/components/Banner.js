import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(80 - Math.random() * 40);
  const [index, setIndex] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const toRotate = [
    "  -Web Developer",  
    "  -Java Programmer",  
    "  -Full Stack Developer",  
    "  -Problem Solver",  
    "  -Professional Debugger (90% of my job)",  
    "  -Code Whisperer",  
    "  -Stack Overflow Researcher",  
    "  -404: Sleep Not Found",  
    "  -Bug Exterminator",  
    "  -Syntax Error Generator",  
    "  -Keyboard Athlete",  
    "  -Coffee-Powered Engineer"  
  ];
  const period = 100;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => Math.max(prevDelta/1.5, 50));
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(500);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(100);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  const handleVisibilityChange = (isVisible) => {
    if (isVisible && !hasAnimated) {
      localStorage.setItem('bannerAnimated', 'true');
      setHasAnimated(true);
    }
  };

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => {
                handleVisibilityChange(isVisible);
                return (
                  <div className={isVisible && !hasAnimated ? "animate__animated animate__fadeIn" : ""}>
                    <span className="tagline">Welcome to my Portfolio</span>
                    <h1>{`Hello! I'm Harshraj`} <span className="txt-rotate" dataPeriod="1000" data-rotate='[ "-Web Developer", "-Java Programmer", "-SDE" ]'><span className="wrap">{text}</span></span></h1>
                    <p>Hey, I'm Harshrajsinh Zala—a web dev who debugs more than he codes! 😆</p>
<p>Building cool web apps, optimizing databases, and making tech do my bidding. Always up for full-stack, AI/ML, and open-source collabs!</p>
<p>Ask me about web dev, databases,or why my IDE crashes more than my WiFi.🚀</p>
<p>Fun fact: I’ve closed my IDE more times than my browser tabs! 😂</p>  
<button onClick={() => console.log('connect')}>Let's Connect <ArrowRightCircle size={25} /></button>
                  </div>
                );
              }}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => {
                handleVisibilityChange(isVisible);
                return (
                  <div className={isVisible && !hasAnimated ? "animate__animated animate__zoomIn" : ""}>
                    <img src={headerImg} alt="Header Img"/>
                  </div>
                );
              }}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

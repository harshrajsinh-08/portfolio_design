import { Col } from "react-bootstrap";
import { BsBoxArrowUpRight } from 'react-icons/bs';

export const ProjectCard = ({ title, description, imgUrl, projectUrl }) => {
  const handleClick = () => {
    try {
      window.open(projectUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening project URL:", error);
    }
  };

  return (
    <Col size={12} sm={6} md={4}>
      <div 
        className="proj-imgbx" 
        onClick={handleClick} 
        style={{ cursor: 'pointer' }}
        role="button"
        aria-label={`View ${title} project`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <img src={imgUrl} alt={`${title} project thumbnail`} />
        <div className="proj-txtx">
          <h4>{title} <BsBoxArrowUpRight style={{ fontSize: '0.8em', marginLeft: '5px' }} /></h4>
          <span>{description}</span>
        </div>
      </div>
    </Col>
  )
}

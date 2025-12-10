import { Navigate } from "react-router-dom";

const Canvas = () => {
  // Redirect to frameworks page since canvas now requires a specific framework
  return <Navigate to="/frameworks" replace />;
};

export default Canvas;

import { useState } from "react";
import colors from "./components/color/color";
import TalkChat from "./components/talk/talk";

function App() {
  const [bgColor, setBgColor] = useState("#ffffff");

  const colorChange = (colorCode) => {
    setBgColor(colorCode);
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "20px" }}>
      <TalkChat colors={colors} onColorChange={colorChange} />
    </div>
  );
}

export default App;

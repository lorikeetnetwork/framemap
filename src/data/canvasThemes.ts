export interface CanvasTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    nodeBackground: string;
    nodeBorder: string;
    nodeText: string;
    connection: string;
    branchColors: string[];
  };
}

export const canvasThemes: CanvasTheme[] = [
  {
    id: "default",
    name: "Default",
    colors: {
      background: "hsl(0 0% 94%)",
      nodeBackground: "hsl(0 0% 96%)",
      nodeBorder: "hsl(0 0% 82%)",
      nodeText: "hsl(0 0% 20%)",
      connection: "hsl(0 0% 70%)",
      branchColors: [
        "hsl(0 0% 38%)",
        "hsl(0 0% 50%)",
        "hsl(0 0% 60%)",
        "hsl(0 0% 70%)",
      ],
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      background: "hsl(200 30% 95%)",
      nodeBackground: "hsl(200 40% 98%)",
      nodeBorder: "hsl(200 40% 70%)",
      nodeText: "hsl(200 50% 20%)",
      connection: "hsl(200 40% 60%)",
      branchColors: [
        "hsl(200 70% 45%)",
        "hsl(180 60% 40%)",
        "hsl(220 60% 50%)",
        "hsl(190 50% 55%)",
      ],
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      background: "hsl(120 20% 94%)",
      nodeBackground: "hsl(120 25% 97%)",
      nodeBorder: "hsl(120 30% 65%)",
      nodeText: "hsl(120 40% 18%)",
      connection: "hsl(120 25% 55%)",
      branchColors: [
        "hsl(120 50% 35%)",
        "hsl(90 45% 40%)",
        "hsl(150 40% 38%)",
        "hsl(100 35% 45%)",
      ],
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: {
      background: "hsl(30 40% 95%)",
      nodeBackground: "hsl(35 50% 98%)",
      nodeBorder: "hsl(25 50% 70%)",
      nodeText: "hsl(20 60% 18%)",
      connection: "hsl(30 45% 60%)",
      branchColors: [
        "hsl(20 70% 50%)",
        "hsl(35 65% 55%)",
        "hsl(10 60% 45%)",
        "hsl(45 55% 50%)",
      ],
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    colors: {
      background: "hsl(270 30% 96%)",
      nodeBackground: "hsl(270 40% 99%)",
      nodeBorder: "hsl(270 35% 75%)",
      nodeText: "hsl(270 40% 20%)",
      connection: "hsl(270 30% 65%)",
      branchColors: [
        "hsl(270 50% 55%)",
        "hsl(290 45% 50%)",
        "hsl(250 40% 55%)",
        "hsl(280 35% 60%)",
      ],
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: {
      background: "hsl(0 0% 98%)",
      nodeBackground: "hsl(0 0% 100%)",
      nodeBorder: "hsl(0 0% 75%)",
      nodeText: "hsl(0 0% 15%)",
      connection: "hsl(0 0% 60%)",
      branchColors: [
        "hsl(0 0% 30%)",
        "hsl(0 0% 40%)",
        "hsl(0 0% 50%)",
        "hsl(0 0% 60%)",
      ],
    },
  },
  {
    id: "contrast",
    name: "High Contrast",
    colors: {
      background: "hsl(0 0% 100%)",
      nodeBackground: "hsl(0 0% 98%)",
      nodeBorder: "hsl(0 0% 0%)",
      nodeText: "hsl(0 0% 0%)",
      connection: "hsl(0 0% 20%)",
      branchColors: [
        "hsl(0 0% 0%)",
        "hsl(0 0% 20%)",
        "hsl(0 0% 35%)",
        "hsl(0 0% 50%)",
      ],
    },
  },
  {
    id: "dark",
    name: "Dark",
    colors: {
      background: "hsl(0 0% 10%)",
      nodeBackground: "hsl(0 0% 14%)",
      nodeBorder: "hsl(0 0% 25%)",
      nodeText: "hsl(0 0% 90%)",
      connection: "hsl(0 0% 40%)",
      branchColors: [
        "hsl(0 0% 60%)",
        "hsl(0 0% 50%)",
        "hsl(0 0% 45%)",
        "hsl(0 0% 40%)",
      ],
    },
  },
];

export function getThemeById(id: string): CanvasTheme {
  return canvasThemes.find((t) => t.id === id) || canvasThemes[0];
}

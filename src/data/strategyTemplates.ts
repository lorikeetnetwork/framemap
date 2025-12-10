import { FrameworkNode } from "@/types/framework";

export interface StrategyTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  understand: string[];
  practice: string[];
  framework: FrameworkNode;
}

export const templateCategories = [
  "Organisational Design & Performance",
  "Strategic Positioning & Competitive Analysis",
  "Market, Customer & Environmental Analysis",
  "Growth, Innovation & Future Planning",
  "Root-Cause Diagnostics & Problem-Solving",
  "Competency & Capability Frameworks",
] as const;

export const strategyTemplates: StrategyTemplate[] = [
  // ============================================
  // ORGANISATIONAL DESIGN & PERFORMANCE
  // ============================================
  {
    id: "mckinsey-7s",
    name: "McKinsey 7-S Framework",
    category: "Organisational Design & Performance",
    description: "Assesses organisational design by examining interconnections between seven key elements.",
    understand: [
      "Structure",
      "Strategy", 
      "Systems",
      "Shared values",
      "Skills",
      "Style",
      "Staff"
    ],
    practice: [
      "Define your company's 7S",
      "Structure – Team and reporting organisation",
      "Strategy – Annual goals and strategic priorities",
      "Systems – Processes, tools, reporting",
      "Shared Values – Vision, mission, culture",
      "Skills – Workforce capabilities",
      "Style – Leadership approach",
      "Staff – Hiring, training, incentives"
    ],
    framework: {
      name: "McKinsey 7-S Framework",
      type: "folder",
      children: [
        {
          name: "Hard Elements",
          type: "folder",
          children: [
            { name: "Structure", type: "folder", description: "Team and reporting organisation", children: [
              { name: "Organisational hierarchy", type: "note" },
              { name: "Reporting lines", type: "note" },
              { name: "Decision-making processes", type: "note" }
            ]},
            { name: "Strategy", type: "folder", description: "Annual goals and strategic priorities", children: [
              { name: "Strategic goals", type: "note" },
              { name: "Competitive advantages", type: "note" },
              { name: "Resource allocation", type: "note" }
            ]},
            { name: "Systems", type: "folder", description: "Processes, tools, reporting", children: [
              { name: "Business processes", type: "note" },
              { name: "IT systems", type: "note" },
              { name: "Performance measurement", type: "note" }
            ]}
          ]
        },
        {
          name: "Soft Elements",
          type: "folder",
          children: [
            { name: "Shared Values", type: "folder", description: "Vision, mission, culture", children: [
              { name: "Core values", type: "note" },
              { name: "Company culture", type: "note" },
              { name: "Mission statement", type: "note" }
            ]},
            { name: "Skills", type: "folder", description: "Workforce capabilities", children: [
              { name: "Core competencies", type: "note" },
              { name: "Training programs", type: "note" },
              { name: "Skill gaps", type: "note" }
            ]},
            { name: "Style", type: "folder", description: "Leadership approach", children: [
              { name: "Leadership style", type: "note" },
              { name: "Management practices", type: "note" },
              { name: "Communication patterns", type: "note" }
            ]},
            { name: "Staff", type: "folder", description: "Hiring, training, incentives", children: [
              { name: "Recruitment", type: "note" },
              { name: "Development programs", type: "note" },
              { name: "Incentive structures", type: "note" }
            ]}
          ]
        }
      ]
    }
  },
  {
    id: "nadler-tushman",
    name: "Nadler-Tushman Congruence Framework",
    category: "Organisational Design & Performance",
    description: "Diagnoses performance issues by assessing alignment between Work, People, Structure, and Culture.",
    understand: ["Work", "People", "Structure", "Culture"],
    practice: [
      "Identify core problem (environment, history, resources)",
      "Identify performance factors for each category",
      "Develop action steps across all categories",
      "Define outputs at organisational, group, and individual level"
    ],
    framework: {
      name: "Nadler-Tushman Congruence Framework",
      type: "folder",
      children: [
        {
          name: "Inputs",
          type: "folder",
          children: [
            { name: "Environment", type: "note", description: "External factors affecting the organisation" },
            { name: "Resources", type: "note", description: "Available assets and capabilities" },
            { name: "History", type: "note", description: "Past patterns and experiences" },
            { name: "Strategy", type: "note", description: "Organisational direction and goals" }
          ]
        },
        {
          name: "Transformation Process",
          type: "folder",
          children: [
            { name: "Work", type: "folder", description: "Tasks and activities", children: [
              { name: "Task requirements", type: "note" },
              { name: "Workflow patterns", type: "note" }
            ]},
            { name: "People", type: "folder", description: "Individual characteristics", children: [
              { name: "Skills and knowledge", type: "note" },
              { name: "Expectations and needs", type: "note" }
            ]},
            { name: "Formal Organisation", type: "folder", description: "Structure and systems", children: [
              { name: "Organisational design", type: "note" },
              { name: "Reward systems", type: "note" }
            ]},
            { name: "Informal Organisation", type: "folder", description: "Culture and norms", children: [
              { name: "Values and beliefs", type: "note" },
              { name: "Informal relationships", type: "note" }
            ]}
          ]
        },
        {
          name: "Outputs",
          type: "folder",
          children: [
            { name: "Organisational Level", type: "note" },
            { name: "Group Level", type: "note" },
            { name: "Individual Level", type: "note" }
          ]
        }
      ]
    }
  },
  {
    id: "porter-value-chain",
    name: "Porter Value Chain Analysis",
    category: "Organisational Design & Performance",
    description: "Breaks down activities from conception to delivery to identify strengths, weaknesses and efficiency opportunities.",
    understand: ["Breaks down activities from conception to delivery to identify strengths/weaknesses and efficiency opportunities."],
    practice: [
      "For each activity: record strengths, weaknesses, improvement ideas",
      "Firm infrastructure", "Human resources", "Technology development",
      "Procurement", "Inbound logistics", "Operations", "Outbound logistics",
      "Marketing & sales", "Service & support", "Prioritise actions with team"
    ],
    framework: {
      name: "Porter Value Chain Analysis",
      type: "folder",
      children: [
        {
          name: "Primary Activities",
          type: "folder",
          children: [
            { name: "Inbound Logistics", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Operations", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Outbound Logistics", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Marketing & Sales", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Service & Support", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]}
          ]
        },
        {
          name: "Support Activities",
          type: "folder",
          children: [
            { name: "Firm Infrastructure", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Human Resource Management", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Technology Development", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]},
            { name: "Procurement", type: "folder", children: [
              { name: "Strengths", type: "note" },
              { name: "Weaknesses", type: "note" },
              { name: "Improvement Ideas", type: "note" }
            ]}
          ]
        },
        { name: "Margin Analysis", type: "note", description: "Overall value created minus costs" }
      ]
    }
  },
  {
    id: "gap-analysis",
    name: "Gap Analysis",
    category: "Organisational Design & Performance",
    description: "Determines whether business goals are being met and identifies underlying issues.",
    understand: ["Determines whether business goals are being met and identifies underlying issues."],
    practice: [
      "Complete the table for a specific unmet business goal",
      "Conduct interviews with relevant teams",
      "Validate and share agreed actions to close the gap"
    ],
    framework: {
      name: "Gap Analysis",
      type: "folder",
      children: [
        { name: "Current State", type: "folder", children: [
          { name: "Current performance metrics", type: "note" },
          { name: "Existing capabilities", type: "note" },
          { name: "Current processes", type: "note" }
        ]},
        { name: "Desired State", type: "folder", children: [
          { name: "Target performance", type: "note" },
          { name: "Required capabilities", type: "note" },
          { name: "Ideal processes", type: "note" }
        ]},
        { name: "Gap Identification", type: "folder", children: [
          { name: "Performance gaps", type: "note" },
          { name: "Capability gaps", type: "note" },
          { name: "Process gaps", type: "note" }
        ]},
        { name: "Action Plan", type: "folder", children: [
          { name: "Priority actions", type: "note" },
          { name: "Resources required", type: "note" },
          { name: "Timeline", type: "note" },
          { name: "Success metrics", type: "note" }
        ]}
      ]
    }
  },
  {
    id: "balanced-scorecard",
    name: "Balanced Scorecard (BSC)",
    category: "Organisational Design & Performance",
    description: "Measures organisational performance across four key perspectives.",
    understand: ["Customer", "Financial", "Internal processes", "Learning & growth"],
    practice: [
      "Define company vision",
      "Set goals within each perspective",
      "Align strategy to these goals",
      "List required actions",
      "Share and discuss with team"
    ],
    framework: {
      name: "Balanced Scorecard",
      type: "folder",
      children: [
        { name: "Vision & Strategy", type: "note", description: "Define the overarching vision" },
        { name: "Financial Perspective", type: "folder", description: "How do we look to shareholders?", children: [
          { name: "Objectives", type: "note" },
          { name: "Measures", type: "note" },
          { name: "Targets", type: "note" },
          { name: "Initiatives", type: "note" }
        ]},
        { name: "Customer Perspective", type: "folder", description: "How do customers see us?", children: [
          { name: "Objectives", type: "note" },
          { name: "Measures", type: "note" },
          { name: "Targets", type: "note" },
          { name: "Initiatives", type: "note" }
        ]},
        { name: "Internal Process Perspective", type: "folder", description: "What must we excel at?", children: [
          { name: "Objectives", type: "note" },
          { name: "Measures", type: "note" },
          { name: "Targets", type: "note" },
          { name: "Initiatives", type: "note" }
        ]},
        { name: "Learning & Growth Perspective", type: "folder", description: "How can we improve?", children: [
          { name: "Objectives", type: "note" },
          { name: "Measures", type: "note" },
          { name: "Targets", type: "note" },
          { name: "Initiatives", type: "note" }
        ]}
      ]
    }
  },

  // ============================================
  // STRATEGIC POSITIONING & COMPETITIVE ANALYSIS
  // ============================================
  {
    id: "porters-five-forces",
    name: "Porter's Five Forces",
    category: "Strategic Positioning & Competitive Analysis",
    description: "Evaluates industry competitiveness through five key forces.",
    understand: [
      "Threat of new entrants",
      "Threat of substitutes",
      "Buyer power",
      "Supplier power",
      "Competitive rivalry"
    ],
    practice: [
      "List emerging competitors",
      "List substitute products/services",
      "Analyse buyer power",
      "Analyse supplier power",
      "Assess rivalry intensity"
    ],
    framework: {
      name: "Porter's Five Forces",
      type: "folder",
      children: [
        { name: "Threat of New Entrants", type: "folder", children: [
          { name: "Barriers to entry", type: "note" },
          { name: "Capital requirements", type: "note" },
          { name: "Brand loyalty", type: "note" },
          { name: "Assessment: High/Medium/Low", type: "note" }
        ]},
        { name: "Threat of Substitutes", type: "folder", children: [
          { name: "Alternative products", type: "note" },
          { name: "Switching costs", type: "note" },
          { name: "Price-performance trade-off", type: "note" },
          { name: "Assessment: High/Medium/Low", type: "note" }
        ]},
        { name: "Bargaining Power of Buyers", type: "folder", children: [
          { name: "Buyer concentration", type: "note" },
          { name: "Price sensitivity", type: "note" },
          { name: "Information availability", type: "note" },
          { name: "Assessment: High/Medium/Low", type: "note" }
        ]},
        { name: "Bargaining Power of Suppliers", type: "folder", children: [
          { name: "Supplier concentration", type: "note" },
          { name: "Uniqueness of inputs", type: "note" },
          { name: "Switching costs", type: "note" },
          { name: "Assessment: High/Medium/Low", type: "note" }
        ]},
        { name: "Competitive Rivalry", type: "folder", children: [
          { name: "Number of competitors", type: "note" },
          { name: "Industry growth rate", type: "note" },
          { name: "Product differentiation", type: "note" },
          { name: "Assessment: High/Medium/Low", type: "note" }
        ]},
        { name: "Strategic Implications", type: "note", description: "Overall industry attractiveness and strategic recommendations" }
      ]
    }
  },
  {
    id: "bowmans-strategy-clock",
    name: "Bowman's Strategy Clock",
    category: "Strategic Positioning & Competitive Analysis",
    description: "Positions offerings based on perceived value and price across eight strategic zones.",
    understand: ["Positions offerings based on perceived value and price across eight strategic zones."],
    practice: [
      "Clock A: Position current products/services",
      "Clock B: Define desired future positions",
      "List actions needed to move from A → B"
    ],
    framework: {
      name: "Bowman's Strategy Clock",
      type: "folder",
      children: [
        { name: "Strategic Positions", type: "folder", children: [
          { name: "1. Low Price/Low Value", type: "note", description: "Bargain basement" },
          { name: "2. Low Price", type: "note", description: "Cost leadership" },
          { name: "3. Hybrid", type: "note", description: "Low cost with differentiation" },
          { name: "4. Differentiation", type: "note", description: "Perceived added value" },
          { name: "5. Focused Differentiation", type: "note", description: "Premium pricing" },
          { name: "6. Risky High Margins", type: "note", description: "High price without value" },
          { name: "7. Monopoly Pricing", type: "note", description: "Standard price, low value" },
          { name: "8. Loss of Market Share", type: "note", description: "Low value, standard price" }
        ]},
        { name: "Current Position Analysis", type: "folder", children: [
          { name: "Product/Service 1", type: "note" },
          { name: "Product/Service 2", type: "note" },
          { name: "Product/Service 3", type: "note" }
        ]},
        { name: "Target Position", type: "folder", children: [
          { name: "Desired position", type: "note" },
          { name: "Actions required", type: "note" }
        ]}
      ]
    }
  },
  {
    id: "bcg-matrix",
    name: "BCG Matrix",
    category: "Strategic Positioning & Competitive Analysis",
    description: "Classifies products/services as Stars, Cash cows, Dogs, or Question marks.",
    understand: ["Stars", "Cash cows", "Dogs", "Question marks"],
    practice: [
      "Place each product/service on the matrix",
      "Choose strategy for each: Consolidate, Keep innovating, Optimize costs, Diversify"
    ],
    framework: {
      name: "BCG Matrix",
      type: "folder",
      children: [
        { name: "Stars", type: "folder", description: "High growth, High market share", children: [
          { name: "Products/Services", type: "note" },
          { name: "Strategy: Invest for growth", type: "note" }
        ]},
        { name: "Cash Cows", type: "folder", description: "Low growth, High market share", children: [
          { name: "Products/Services", type: "note" },
          { name: "Strategy: Milk for cash", type: "note" }
        ]},
        { name: "Question Marks", type: "folder", description: "High growth, Low market share", children: [
          { name: "Products/Services", type: "note" },
          { name: "Strategy: Invest or divest", type: "note" }
        ]},
        { name: "Dogs", type: "folder", description: "Low growth, Low market share", children: [
          { name: "Products/Services", type: "note" },
          { name: "Strategy: Divest or liquidate", type: "note" }
        ]},
        { name: "Portfolio Summary", type: "note", description: "Overall portfolio balance assessment" }
      ]
    }
  },
  {
    id: "porter-diamond",
    name: "Porter Diamond Model",
    category: "Strategic Positioning & Competitive Analysis",
    description: "Analyses national/regional competitive advantage across four key factors.",
    understand: ["Factor conditions", "Demand conditions", "Firm strategy & rivalry", "Related/supporting industries"],
    practice: [
      "Assess national factors/resources",
      "Assess domestic demand conditions",
      "Assess firm behaviours and strategies",
      "Assess competition and supporting industries",
      "Synthesise insights"
    ],
    framework: {
      name: "Porter Diamond Model",
      type: "folder",
      children: [
        { name: "Factor Conditions", type: "folder", description: "National resources and capabilities", children: [
          { name: "Human resources", type: "note" },
          { name: "Physical resources", type: "note" },
          { name: "Knowledge resources", type: "note" },
          { name: "Capital resources", type: "note" },
          { name: "Infrastructure", type: "note" }
        ]},
        { name: "Demand Conditions", type: "folder", description: "Nature of home market demand", children: [
          { name: "Market size", type: "note" },
          { name: "Buyer sophistication", type: "note" },
          { name: "Demand growth rate", type: "note" }
        ]},
        { name: "Related & Supporting Industries", type: "folder", children: [
          { name: "Supplier industries", type: "note" },
          { name: "Related industries", type: "note" },
          { name: "Cluster strength", type: "note" }
        ]},
        { name: "Firm Strategy, Structure & Rivalry", type: "folder", children: [
          { name: "Domestic competition", type: "note" },
          { name: "Management practices", type: "note" },
          { name: "Goals and strategies", type: "note" }
        ]},
        { name: "Government Role", type: "note" },
        { name: "Chance Events", type: "note" }
      ]
    }
  },
  {
    id: "experience-curve",
    name: "The Experience Curve",
    category: "Strategic Positioning & Competitive Analysis",
    description: "Costs decrease with cumulative output; experience improves efficiency and competitiveness.",
    understand: ["Costs decrease with cumulative output; experience improves efficiency and competitiveness."],
    practice: [
      "Track cumulative production volume",
      "Measure unit cost trends",
      "Identify learning rate",
      "Project future costs"
    ],
    framework: {
      name: "The Experience Curve",
      type: "folder",
      children: [
        { name: "Historical Data", type: "folder", children: [
          { name: "Cumulative production volume", type: "note" },
          { name: "Unit cost over time", type: "note" },
          { name: "Learning rate calculation", type: "note" }
        ]},
        { name: "Cost Components", type: "folder", children: [
          { name: "Labour efficiency gains", type: "note" },
          { name: "Process improvements", type: "note" },
          { name: "Technology advances", type: "note" },
          { name: "Scale economies", type: "note" }
        ]},
        { name: "Strategic Implications", type: "folder", children: [
          { name: "Pricing strategy", type: "note" },
          { name: "Market share goals", type: "note" },
          { name: "Investment decisions", type: "note" }
        ]}
      ]
    }
  },
  {
    id: "blue-ocean-strategy",
    name: "Blue Ocean Strategy",
    category: "Strategic Positioning & Competitive Analysis",
    description: "Create uncontested market space by combining differentiation and low cost.",
    understand: ["Create uncontested market space by combining differentiation and low cost."],
    practice: [
      "Create uncontested market space",
      "Make competition irrelevant",
      "Create/capture new demand",
      "Break value–cost trade-off",
      "Align entire system to differentiation + low cost"
    ],
    framework: {
      name: "Blue Ocean Strategy",
      type: "folder",
      children: [
        { name: "Current State Analysis", type: "folder", children: [
          { name: "Industry boundaries", type: "note" },
          { name: "Competitive factors", type: "note" },
          { name: "Red ocean characteristics", type: "note" }
        ]},
        { name: "Four Actions Framework", type: "folder", children: [
          { name: "Eliminate", type: "note", description: "Which factors should be eliminated?" },
          { name: "Reduce", type: "note", description: "Which factors should be reduced below standard?" },
          { name: "Raise", type: "note", description: "Which factors should be raised above standard?" },
          { name: "Create", type: "note", description: "Which factors should be created that never existed?" }
        ]},
        { name: "Strategy Canvas", type: "folder", children: [
          { name: "Current value curve", type: "note" },
          { name: "New value curve", type: "note" }
        ]},
        { name: "Implementation", type: "folder", children: [
          { name: "Tipping point leadership", type: "note" },
          { name: "Fair process", type: "note" }
        ]}
      ]
    }
  },

  // ============================================
  // MARKET, CUSTOMER & ENVIRONMENTAL ANALYSIS
  // ============================================
  {
    id: "pest-analysis",
    name: "PEST Analysis",
    category: "Market, Customer & Environmental Analysis",
    description: "Evaluates macro-environment across Political, Economic, Social, and Technological factors.",
    understand: ["Political", "Economic", "Social", "Technological"],
    practice: [
      "Analyse political environment",
      "Analyse economic environment",
      "Analyse social environment",
      "Analyse technological environment",
      "Build PEST synthesis matrix"
    ],
    framework: {
      name: "PEST Analysis",
      type: "folder",
      children: [
        { name: "Political Factors", type: "folder", children: [
          { name: "Government policies", type: "note" },
          { name: "Political stability", type: "note" },
          { name: "Regulations", type: "note" },
          { name: "Trade restrictions", type: "note" },
          { name: "Tax policy", type: "note" }
        ]},
        { name: "Economic Factors", type: "folder", children: [
          { name: "Economic growth", type: "note" },
          { name: "Interest rates", type: "note" },
          { name: "Inflation", type: "note" },
          { name: "Exchange rates", type: "note" },
          { name: "Unemployment", type: "note" }
        ]},
        { name: "Social Factors", type: "folder", children: [
          { name: "Demographics", type: "note" },
          { name: "Cultural trends", type: "note" },
          { name: "Lifestyle changes", type: "note" },
          { name: "Education levels", type: "note" },
          { name: "Health consciousness", type: "note" }
        ]},
        { name: "Technological Factors", type: "folder", children: [
          { name: "R&D activity", type: "note" },
          { name: "Automation", type: "note" },
          { name: "Technology incentives", type: "note" },
          { name: "Rate of change", type: "note" },
          { name: "Digital trends", type: "note" }
        ]},
        { name: "PEST Synthesis", type: "note", description: "Key implications and strategic responses" }
      ]
    }
  },
  {
    id: "3cs-marketing",
    name: "The 3Cs of Marketing",
    category: "Market, Customer & Environmental Analysis",
    description: "Strategic evaluation of Customers, Competitors, and Company.",
    understand: ["Customers", "Competitors", "Company"],
    practice: [
      "Define customers: demographics, motivations, unmet needs",
      "Define competitors: strengths, differentiation",
      "Clarify company: vision, strategy, USP, reputation, culture"
    ],
    framework: {
      name: "The 3Cs of Marketing",
      type: "folder",
      children: [
        { name: "Customer Analysis", type: "folder", children: [
          { name: "Customer segments", type: "note" },
          { name: "Demographics", type: "note" },
          { name: "Buying motivations", type: "note" },
          { name: "Unmet needs", type: "note" },
          { name: "Decision journey", type: "note" }
        ]},
        { name: "Competitor Analysis", type: "folder", children: [
          { name: "Key competitors", type: "note" },
          { name: "Competitor strengths", type: "note" },
          { name: "Competitor weaknesses", type: "note" },
          { name: "Differentiation factors", type: "note" },
          { name: "Market positioning", type: "note" }
        ]},
        { name: "Company Analysis", type: "folder", children: [
          { name: "Vision & mission", type: "note" },
          { name: "Core strategy", type: "note" },
          { name: "Unique selling proposition", type: "note" },
          { name: "Reputation", type: "note" },
          { name: "Culture & values", type: "note" }
        ]},
        { name: "Strategic Fit", type: "note", description: "Alignment between 3Cs" }
      ]
    }
  },
  {
    id: "innovation-diffusion",
    name: "Innovation Diffusion Lifecycle",
    category: "Market, Customer & Environmental Analysis",
    description: "Categorises adopters from innovators to laggards.",
    understand: ["Categorises adopters: innovators → laggards."],
    practice: [
      "Define your current target group",
      "Create action plans for: Innovators, Early adopters, Early majority, Late majority, Laggards"
    ],
    framework: {
      name: "Innovation Diffusion Lifecycle",
      type: "folder",
      children: [
        { name: "Innovators (2.5%)", type: "folder", description: "Risk-takers, first to adopt", children: [
          { name: "Characteristics", type: "note" },
          { name: "Marketing approach", type: "note" },
          { name: "Action plan", type: "note" }
        ]},
        { name: "Early Adopters (13.5%)", type: "folder", description: "Opinion leaders", children: [
          { name: "Characteristics", type: "note" },
          { name: "Marketing approach", type: "note" },
          { name: "Action plan", type: "note" }
        ]},
        { name: "Early Majority (34%)", type: "folder", description: "Deliberate adopters", children: [
          { name: "Characteristics", type: "note" },
          { name: "Marketing approach", type: "note" },
          { name: "Action plan", type: "note" }
        ]},
        { name: "Late Majority (34%)", type: "folder", description: "Skeptical adopters", children: [
          { name: "Characteristics", type: "note" },
          { name: "Marketing approach", type: "note" },
          { name: "Action plan", type: "note" }
        ]},
        { name: "Laggards (16%)", type: "folder", description: "Traditional, last to adopt", children: [
          { name: "Characteristics", type: "note" },
          { name: "Marketing approach", type: "note" },
          { name: "Action plan", type: "note" }
        ]},
        { name: "Current Target & Chasm", type: "note", description: "Which segment are we targeting? Have we crossed the chasm?" }
      ]
    }
  },
  {
    id: "hyper-competition",
    name: "Dealing with Hyper-Competition",
    category: "Market, Customer & Environmental Analysis",
    description: "Rapid competitive cycles require agility across four areas.",
    understand: ["Rapid competitive cycles require agility across four areas."],
    practice: [
      "Technological advancements: list enabling technologies",
      "Client modifications: document behavioural shifts",
      "Diminishing borders: explore new markets",
      "Financial self-reliance: define battle budget"
    ],
    framework: {
      name: "Dealing with Hyper-Competition",
      type: "folder",
      children: [
        { name: "Technological Advancements", type: "folder", children: [
          { name: "Enabling technologies", type: "note" },
          { name: "Disruption potential", type: "note" },
          { name: "Response strategy", type: "note" }
        ]},
        { name: "Client Modifications", type: "folder", children: [
          { name: "Behavioural shifts", type: "note" },
          { name: "Changing expectations", type: "note" },
          { name: "Adaptation strategy", type: "note" }
        ]},
        { name: "Diminishing Borders", type: "folder", children: [
          { name: "New market opportunities", type: "note" },
          { name: "Global competition", type: "note" },
          { name: "Expansion strategy", type: "note" }
        ]},
        { name: "Financial Self-Reliance", type: "folder", children: [
          { name: "Battle budget", type: "note" },
          { name: "Resource allocation", type: "note" },
          { name: "Investment priorities", type: "note" }
        ]},
        { name: "Agility Assessment", type: "note", description: "Overall organisational agility score" }
      ]
    }
  },

  // ============================================
  // GROWTH, INNOVATION & FUTURE PLANNING
  // ============================================
  {
    id: "ansoff-matrix",
    name: "Ansoff Growth Matrix",
    category: "Growth, Innovation & Future Planning",
    description: "Four growth strategies: Market penetration, Market development, Product development, Diversification.",
    understand: ["Market penetration", "Market development", "Product development", "Diversification"],
    practice: [
      "Place each product/service on the matrix",
      "Select strategy per offering"
    ],
    framework: {
      name: "Ansoff Growth Matrix",
      type: "folder",
      children: [
        { name: "Market Penetration", type: "folder", description: "Existing products, Existing markets", children: [
          { name: "Current products", type: "note" },
          { name: "Growth tactics", type: "note" },
          { name: "Risk level: Low", type: "note" }
        ]},
        { name: "Market Development", type: "folder", description: "Existing products, New markets", children: [
          { name: "Target new markets", type: "note" },
          { name: "Entry strategy", type: "note" },
          { name: "Risk level: Medium", type: "note" }
        ]},
        { name: "Product Development", type: "folder", description: "New products, Existing markets", children: [
          { name: "New product ideas", type: "note" },
          { name: "Development plan", type: "note" },
          { name: "Risk level: Medium", type: "note" }
        ]},
        { name: "Diversification", type: "folder", description: "New products, New markets", children: [
          { name: "Diversification opportunities", type: "note" },
          { name: "Related vs unrelated", type: "note" },
          { name: "Risk level: High", type: "note" }
        ]},
        { name: "Growth Strategy Summary", type: "note" }
      ]
    }
  },
  {
    id: "scenario-planning",
    name: "Scenario Planning",
    category: "Growth, Innovation & Future Planning",
    description: "Projects future environments and strategic responses.",
    understand: ["Projects future environments and strategic responses."],
    practice: [
      "List external/environmental factors",
      "List strategic goals",
      "List forecasts and uncertainties",
      "Develop multiple scenarios",
      "Place scenarios on the uncertainty/impact matrix"
    ],
    framework: {
      name: "Scenario Planning",
      type: "folder",
      children: [
        { name: "Environmental Factors", type: "folder", children: [
          { name: "External trends", type: "note" },
          { name: "Key uncertainties", type: "note" },
          { name: "Driving forces", type: "note" }
        ]},
        { name: "Strategic Goals", type: "note" },
        { name: "Scenario Development", type: "folder", children: [
          { name: "Scenario 1: Best Case", type: "folder", children: [
            { name: "Description", type: "note" },
            { name: "Key assumptions", type: "note" },
            { name: "Strategic response", type: "note" }
          ]},
          { name: "Scenario 2: Worst Case", type: "folder", children: [
            { name: "Description", type: "note" },
            { name: "Key assumptions", type: "note" },
            { name: "Strategic response", type: "note" }
          ]},
          { name: "Scenario 3: Most Likely", type: "folder", children: [
            { name: "Description", type: "note" },
            { name: "Key assumptions", type: "note" },
            { name: "Strategic response", type: "note" }
          ]},
          { name: "Scenario 4: Wildcard", type: "folder", children: [
            { name: "Description", type: "note" },
            { name: "Key assumptions", type: "note" },
            { name: "Strategic response", type: "note" }
          ]}
        ]},
        { name: "Impact/Uncertainty Matrix", type: "note" },
        { name: "Robust Strategies", type: "note", description: "Strategies that work across scenarios" }
      ]
    }
  },
  {
    id: "six-sigma",
    name: "Six Sigma (DMAIC/DMADV)",
    category: "Growth, Innovation & Future Planning",
    description: "Improves processes (DMAIC) or designs new ones (DMADV).",
    understand: ["Improves processes (DMAIC) or designs new ones (DMADV)."],
    practice: [
      "DMAIC: Define, Measure, Analyse, Improve, Control",
      "DMADV: Define, Measure, Analyse, Design, Verify"
    ],
    framework: {
      name: "Six Sigma",
      type: "folder",
      children: [
        { name: "DMAIC (Improve Existing)", type: "folder", children: [
          { name: "Define", type: "folder", children: [
            { name: "Problem statement", type: "note" },
            { name: "Project scope", type: "note" },
            { name: "Goals", type: "note" }
          ]},
          { name: "Measure", type: "folder", children: [
            { name: "Current performance", type: "note" },
            { name: "Data collection plan", type: "note" },
            { name: "Baseline metrics", type: "note" }
          ]},
          { name: "Analyse", type: "folder", children: [
            { name: "Root cause analysis", type: "note" },
            { name: "Data analysis", type: "note" },
            { name: "Process mapping", type: "note" }
          ]},
          { name: "Improve", type: "folder", children: [
            { name: "Solution options", type: "note" },
            { name: "Implementation plan", type: "note" },
            { name: "Pilot results", type: "note" }
          ]},
          { name: "Control", type: "folder", children: [
            { name: "Control plan", type: "note" },
            { name: "Monitoring systems", type: "note" },
            { name: "Sustainability measures", type: "note" }
          ]}
        ]},
        { name: "DMADV (Design New)", type: "folder", children: [
          { name: "Define", type: "note", description: "Customer requirements" },
          { name: "Measure", type: "note", description: "Customer needs assessment" },
          { name: "Analyse", type: "note", description: "Design alternatives" },
          { name: "Design", type: "note", description: "Detailed solution design" },
          { name: "Verify", type: "note", description: "Testing and validation" }
        ]}
      ]
    }
  },
  {
    id: "delta-model",
    name: "Delta Model",
    category: "Growth, Innovation & Future Planning",
    description: "Customer bonding through three strategies: Best Product, Total Customer Solutions, System Lock-In.",
    understand: ["Best Product", "Total Customer Solutions", "System Lock-In"],
    practice: [
      "Map each product/service to a strategy",
      "Define desired evolution over time"
    ],
    framework: {
      name: "Delta Model",
      type: "folder",
      children: [
        { name: "Best Product", type: "folder", description: "Product economics focus", children: [
          { name: "Low cost strategy", type: "note" },
          { name: "Differentiation strategy", type: "note" },
          { name: "Products/services", type: "note" }
        ]},
        { name: "Total Customer Solutions", type: "folder", description: "Customer economics focus", children: [
          { name: "Customer integration", type: "note" },
          { name: "Horizontal breadth", type: "note" },
          { name: "Products/services", type: "note" }
        ]},
        { name: "System Lock-In", type: "folder", description: "System economics focus", children: [
          { name: "Proprietary standard", type: "note" },
          { name: "Dominant exchange", type: "note" },
          { name: "Complementor lock-in", type: "note" },
          { name: "Products/services", type: "note" }
        ]},
        { name: "Evolution Strategy", type: "note", description: "How to move between positions over time" }
      ]
    }
  },
  {
    id: "triple-bottom-line",
    name: "Triple Bottom Line (3Ps)",
    category: "Growth, Innovation & Future Planning",
    description: "Measures performance across Profit, People, and Planet.",
    understand: ["Profit", "People", "Planet"],
    practice: [
      "Define KPIs for each area",
      "Align teams around KPI objectives"
    ],
    framework: {
      name: "Triple Bottom Line",
      type: "folder",
      children: [
        { name: "Profit", type: "folder", description: "Economic sustainability", children: [
          { name: "Revenue growth", type: "note" },
          { name: "Profitability", type: "note" },
          { name: "Economic value", type: "note" },
          { name: "KPIs", type: "note" }
        ]},
        { name: "People", type: "folder", description: "Social sustainability", children: [
          { name: "Employee welfare", type: "note" },
          { name: "Community impact", type: "note" },
          { name: "Fair practices", type: "note" },
          { name: "KPIs", type: "note" }
        ]},
        { name: "Planet", type: "folder", description: "Environmental sustainability", children: [
          { name: "Carbon footprint", type: "note" },
          { name: "Resource usage", type: "note" },
          { name: "Waste reduction", type: "note" },
          { name: "KPIs", type: "note" }
        ]},
        { name: "Integration Strategy", type: "note", description: "How 3Ps align with business strategy" }
      ]
    }
  },

  // ============================================
  // ROOT-CAUSE DIAGNOSTICS & PROBLEM-SOLVING
  // ============================================
  {
    id: "fishbone-diagram",
    name: "Fishbone (Ishikawa) Diagram",
    category: "Root-Cause Diagnostics & Problem-Solving",
    description: "Identifies root causes of failures using categories: Equipment, Process, People, Materials, Environment, Management.",
    understand: ["Equipment", "Process", "People", "Materials", "Environment", "Management"],
    practice: [
      "Choose the core issue",
      "List primary causes across categories",
      "For each cause, ask 'why?' repeatedly to uncover deeper causes"
    ],
    framework: {
      name: "Fishbone Diagram",
      type: "folder",
      children: [
        { name: "Problem Statement", type: "note", description: "Define the core issue to analyse" },
        { name: "Equipment/Machine", type: "folder", children: [
          { name: "Primary causes", type: "note" },
          { name: "Why? (Level 1)", type: "note" },
          { name: "Why? (Level 2)", type: "note" }
        ]},
        { name: "Process/Method", type: "folder", children: [
          { name: "Primary causes", type: "note" },
          { name: "Why? (Level 1)", type: "note" },
          { name: "Why? (Level 2)", type: "note" }
        ]},
        { name: "People", type: "folder", children: [
          { name: "Primary causes", type: "note" },
          { name: "Why? (Level 1)", type: "note" },
          { name: "Why? (Level 2)", type: "note" }
        ]},
        { name: "Materials", type: "folder", children: [
          { name: "Primary causes", type: "note" },
          { name: "Why? (Level 1)", type: "note" },
          { name: "Why? (Level 2)", type: "note" }
        ]},
        { name: "Environment", type: "folder", children: [
          { name: "Primary causes", type: "note" },
          { name: "Why? (Level 1)", type: "note" },
          { name: "Why? (Level 2)", type: "note" }
        ]},
        { name: "Management", type: "folder", children: [
          { name: "Primary causes", type: "note" },
          { name: "Why? (Level 1)", type: "note" },
          { name: "Why? (Level 2)", type: "note" }
        ]},
        { name: "Root Cause Summary", type: "note" },
        { name: "Action Plan", type: "note" }
      ]
    }
  },
  {
    id: "tipping-point-leadership",
    name: "Tipping Point Leadership",
    category: "Root-Cause Diagnostics & Problem-Solving",
    description: "Identifies hurdles preventing organisational momentum: Cognitive, Resource, Motivational, Political.",
    understand: ["Cognitive", "Resource", "Motivational", "Political"],
    practice: [
      "Cognitive: list mental blocks",
      "Resource: evaluate internal capabilities and gaps",
      "Motivational: assess incentives, engagement, placement",
      "Political: assess internal political forces affecting outcomes"
    ],
    framework: {
      name: "Tipping Point Leadership",
      type: "folder",
      children: [
        { name: "Cognitive Hurdle", type: "folder", description: "Breaking through mental blocks", children: [
          { name: "Current mindset barriers", type: "note" },
          { name: "Face-to-face with problems", type: "note" },
          { name: "Wake-up call strategies", type: "note" }
        ]},
        { name: "Resource Hurdle", type: "folder", description: "Doing more with less", children: [
          { name: "Hot spots (high return)", type: "note" },
          { name: "Cold spots (resource sinks)", type: "note" },
          { name: "Horse trading opportunities", type: "note" }
        ]},
        { name: "Motivational Hurdle", type: "folder", description: "Getting people to move", children: [
          { name: "Key influencers", type: "note" },
          { name: "Fishbowl management", type: "note" },
          { name: "Atomization of change", type: "note" }
        ]},
        { name: "Political Hurdle", type: "folder", description: "Overcoming resistance", children: [
          { name: "Angels (supporters)", type: "note" },
          { name: "Devils (opponents)", type: "note" },
          { name: "Consigliere strategy", type: "note" }
        ]},
        { name: "Tipping Point Strategy", type: "note", description: "Integrated approach to break through" }
      ]
    }
  },

  // ============================================
  // COMPETENCY & CAPABILITY FRAMEWORKS
  // ============================================
  {
    id: "business-competencies",
    name: "Business Competencies Mapping",
    category: "Competency & Capability Frameworks",
    description: "Comprehensive competency list for job design, hiring, and performance management.",
    understand: ["Comprehensive competency list for job design, hiring, and performance management."],
    practice: [
      "Map competencies across: Strategic Management, Customer Relationship, Product & Service Development, Production, Marketing & Sales, Enterprise Support, Procurement & Logistics, Finance & Controlling"
    ],
    framework: {
      name: "Business Competencies Mapping",
      type: "folder",
      children: [
        { name: "Strategic Management", type: "folder", children: [
          { name: "Vision & direction", type: "note" },
          { name: "Strategic thinking", type: "note" },
          { name: "Change leadership", type: "note" }
        ]},
        { name: "Customer Relationship", type: "folder", children: [
          { name: "Customer focus", type: "note" },
          { name: "Relationship building", type: "note" },
          { name: "Service excellence", type: "note" }
        ]},
        { name: "Product & Service Development", type: "folder", children: [
          { name: "Innovation", type: "note" },
          { name: "Design thinking", type: "note" },
          { name: "Quality focus", type: "note" }
        ]},
        { name: "Production/Operations", type: "folder", children: [
          { name: "Process management", type: "note" },
          { name: "Efficiency focus", type: "note" },
          { name: "Quality control", type: "note" }
        ]},
        { name: "Marketing & Sales", type: "folder", children: [
          { name: "Market awareness", type: "note" },
          { name: "Sales effectiveness", type: "note" },
          { name: "Brand management", type: "note" }
        ]},
        { name: "Enterprise Support", type: "folder", children: [
          { name: "HR competencies", type: "note" },
          { name: "IT competencies", type: "note" },
          { name: "Administrative excellence", type: "note" }
        ]},
        { name: "Procurement & Logistics", type: "folder", children: [
          { name: "Supplier management", type: "note" },
          { name: "Supply chain", type: "note" },
          { name: "Cost management", type: "note" }
        ]},
        { name: "Finance & Controlling", type: "folder", children: [
          { name: "Financial acumen", type: "note" },
          { name: "Risk management", type: "note" },
          { name: "Analytical skills", type: "note" }
        ]}
      ]
    }
  },
  {
    id: "competency-framework",
    name: "Competency Framework",
    category: "Competency & Capability Frameworks",
    description: "Defines required competencies across roles and seniority levels.",
    understand: ["Defines required competencies across roles and seniority levels."],
    practice: [
      "Map team skills across: Technical, Business, People, Leadership, Digital",
      "Update job descriptions and offers",
      "Use framework in performance reviews"
    ],
    framework: {
      name: "Competency Framework",
      type: "folder",
      children: [
        { name: "Technical Competencies", type: "folder", children: [
          { name: "Entry level", type: "note" },
          { name: "Mid level", type: "note" },
          { name: "Senior level", type: "note" },
          { name: "Expert level", type: "note" }
        ]},
        { name: "Business Competencies", type: "folder", children: [
          { name: "Entry level", type: "note" },
          { name: "Mid level", type: "note" },
          { name: "Senior level", type: "note" },
          { name: "Expert level", type: "note" }
        ]},
        { name: "People Competencies", type: "folder", children: [
          { name: "Entry level", type: "note" },
          { name: "Mid level", type: "note" },
          { name: "Senior level", type: "note" },
          { name: "Expert level", type: "note" }
        ]},
        { name: "Leadership Competencies", type: "folder", children: [
          { name: "Team lead", type: "note" },
          { name: "Manager", type: "note" },
          { name: "Director", type: "note" },
          { name: "Executive", type: "note" }
        ]},
        { name: "Digital Competencies", type: "folder", children: [
          { name: "Entry level", type: "note" },
          { name: "Mid level", type: "note" },
          { name: "Senior level", type: "note" },
          { name: "Expert level", type: "note" }
        ]},
        { name: "Application", type: "folder", children: [
          { name: "Job descriptions", type: "note" },
          { name: "Hiring criteria", type: "note" },
          { name: "Performance reviews", type: "note" },
          { name: "Development plans", type: "note" }
        ]}
      ]
    }
  },
  {
    id: "vmost-framework",
    name: "VMOST Framework",
    category: "Competency & Capability Frameworks",
    description: "Ensures alignment from vision → tactics: Vision, Mission, Objectives, Strategy, Tactics.",
    understand: ["Vision", "Mission", "Objectives", "Strategy", "Tactics"],
    practice: [
      "Define Vision",
      "Define Mission",
      "Define Objectives",
      "Build Strategy",
      "Define Tactics"
    ],
    framework: {
      name: "VMOST Framework",
      type: "folder",
      children: [
        { name: "Vision", type: "folder", description: "Where do we want to be?", children: [
          { name: "Long-term vision", type: "note" },
          { name: "Aspirational goals", type: "note" },
          { name: "Future state", type: "note" }
        ]},
        { name: "Mission", type: "folder", description: "Why do we exist?", children: [
          { name: "Purpose statement", type: "note" },
          { name: "Core function", type: "note" },
          { name: "Value we provide", type: "note" }
        ]},
        { name: "Objectives", type: "folder", description: "What do we need to achieve?", children: [
          { name: "SMART goals", type: "note" },
          { name: "Key results", type: "note" },
          { name: "Milestones", type: "note" }
        ]},
        { name: "Strategy", type: "folder", description: "How will we get there?", children: [
          { name: "Strategic priorities", type: "note" },
          { name: "Key initiatives", type: "note" },
          { name: "Resource allocation", type: "note" }
        ]},
        { name: "Tactics", type: "folder", description: "What specific actions?", children: [
          { name: "Action plans", type: "note" },
          { name: "Task assignments", type: "note" },
          { name: "Timelines", type: "note" },
          { name: "Budgets", type: "note" }
        ]},
        { name: "Alignment Check", type: "note", description: "Verify all levels are aligned" }
      ]
    }
  }
];

export const getTemplatesByCategory = () => {
  const grouped: Record<string, StrategyTemplate[]> = {};
  templateCategories.forEach(category => {
    grouped[category] = strategyTemplates.filter(t => t.category === category);
  });
  return grouped;
};

export const getTemplateById = (id: string) => {
  return strategyTemplates.find(t => t.id === id);
};

import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  InputAdornment,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  MenuBook as BookIcon,
  Quiz as QuizIcon,
  TableChart as TableIcon,
  AutoGraph as ChartIcon,
  Lightbulb as TipIcon,
  Code as CodeIcon,
  AutoAwesome as SparkleIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  RestartAlt as ResetIcon,
  TimerOutlined as TimerIcon,
} from "@mui/icons-material";
import { generateLesson, resetLesson } from "../app/slices/lessonSlice";
import { generateQuizzes, resetQuizzes } from "../app/slices/quizSlice";

// Hoist static suggestion topics per vercel-react-best-practices (rendering-hoist-jsx)
const SUGGESTED_TOPICS = [
  "Quantum Computing Foundations",
  "Spanish Subjunctive Mood",
  "Distributed Systems & Raft Consensus",
  "Machine Learning Gradient Descent",
  "Cellular Respiration & Krebs Cycle",
  "React Server Components & SSR",
];

// Hoist static rules for generating structured lessons with tables, charts, and rich markdown
const LESSON_MARKDOWN_RULES = `
Strict Markdown Formatting and Structural Rules:
1. **Title & Hierarchy**:
   - Begin with a single top-level title: '# [Lesson Topic]'
   - Structure into clear modular sections using '##' (e.g., ## 1. Overview, ## 2. Core Concepts, ## 3. Comparison Matrix, ## 4. Visual Workflow & Architecture, ## 5. Practical Implementation, ## 6. Pro-Tips & Common Pitfalls, ## 7. Summary Checklist).
   - Use '###' for specific sub-topics and practical breakdowns.
2. **Tables (Mandatory)**:
   - Provide at least one comprehensive comparison or reference table using standard GitHub Flavored Markdown (GFM) pipe syntax.
   - Include aligned column headers (e.g., | Feature | Description | Practical Example | Key Benefit / Performance |).
3. **Charts & Visual Diagrams (Mandatory)**:
   - Include a visual workflow, architecture diagram, or concept hierarchy map inside a \`\`\`text or \`\`\`flowchart code block using structured ASCII/Unicode symbols (e.g., [Step 1] ──► [Step 2] ──► [Step 3] or ├── Component └── Subcomponent).
   - Provide a visual metric/comparison rating meter where relevant (e.g., Complexity: [★★★★☆], Performance: [████████░░] 80%).
4. **Callouts & Best Practices**:
   - Highlight tips, warnings, and definitions using Markdown blockquotes:
     > 💡 **Pro-Tip:** [Actionable best practice]
     > ⚠️ **Common Pitfall:** [Mistake to avoid]
     > 📌 **Key Takeaway:** [Core insight]
5. **Code & Syntax Blocks**:
   - Use fenced code blocks with appropriate language tags (\`\`\`javascript, \`\`\`python, \`\`\`html, etc.) with concise, readable code.
6. **Typography & Emphasis**:
   - Bold key terms (**Term**) upon first introduction with a brief explanation.
   - Use bullet points and numbered lists for sequential steps and takeaways.
`.trim();

const buildLessonPrompt = (topic) => {
  return `Please generate a comprehensive, in-depth educational lesson on: "${topic.trim()}".

Follow these strict structure and Markdown formatting rules:
${LESSON_MARKDOWN_RULES}`;
};

// Rich typography and component mapping for ReactMarkdown
const markdownComponents = {
  h1: ({ children, ...props }) => (
    <Typography
      variant="h4"
      component="h1"
      sx={{
        fontWeight: 800,
        color: "#0f172a",
        fontSize: { xs: "1.6rem", sm: "2rem" },
        letterSpacing: "-0.025em",
        mt: 1.5,
        mb: 2.5,
        pb: 1.5,
        borderBottom: "2px solid #e2e8f0",
      }}
      {...props}
    >
      {children}
    </Typography>
  ),
  h2: ({ children, ...props }) => (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        fontWeight: 700,
        color: "#3730a3",
        fontSize: { xs: "1.25rem", sm: "1.45rem" },
        letterSpacing: "-0.015em",
        mt: 3.5,
        mb: 2,
        pb: 0.5,
      }}
      {...props}
    >
      {children}
    </Typography>
  ),
  h3: ({ children, ...props }) => (
    <Typography
      variant="h6"
      component="h3"
      sx={{
        fontWeight: 600,
        color: "#1e293b",
        fontSize: { xs: "1.05rem", sm: "1.2rem" },
        mt: 2.5,
        mb: 1.5,
      }}
      {...props}
    >
      {children}
    </Typography>
  ),
  p: ({ children, ...props }) => (
    <Typography
      variant="body1"
      component="p"
      sx={{
        color: "#334155",
        fontSize: { xs: "0.95rem", sm: "1.025rem" },
        lineHeight: 1.8,
        mb: 2,
      }}
      {...props}
    >
      {children}
    </Typography>
  ),
  table: ({ children, ...props }) => (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        my: 3,
        borderRadius: 3,
        border: "1px solid #cbd5e1",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          minWidth: 540,
        }}
        {...props}
      >
        {children}
      </Box>
    </Box>
  ),
  thead: ({ children, ...props }) => (
    <Box
      component="thead"
      sx={{
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #cbd5e1",
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  tbody: ({ children, ...props }) => (
    <Box component="tbody" {...props}>
      {children}
    </Box>
  ),
  tr: ({ children, ...props }) => (
    <Box
      component="tr"
      sx={{
        borderBottom: "1px solid #e2e8f0",
        "&:last-child": { borderBottom: "none" },
        "&:hover": { backgroundColor: "#f8fafc" },
        transition: "background-color 0.15s ease",
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  th: ({ children, ...props }) => (
    <Box
      component="th"
      sx={{
        px: 2.5,
        py: 1.75,
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  td: ({ children, ...props }) => (
    <Box
      component="td"
      sx={{
        px: 2.5,
        py: 1.5,
        fontSize: "0.925rem",
        color: "#334155",
        lineHeight: 1.6,
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  blockquote: ({ children, ...props }) => (
    <Paper
      elevation={0}
      component="blockquote"
      sx={{
        borderLeft: "4px solid #4f46e5",
        background: "linear-gradient(90deg, rgba(79, 70, 229, 0.05) 0%, rgba(248, 250, 252, 0.8) 100%)",
        py: 1.75,
        px: 2.5,
        my: 2.5,
        borderRadius: "0 10px 10px 0",
        border: "1px solid rgba(79, 70, 229, 0.15)",
        borderLeftWidth: 4,
        borderLeftColor: "#4f46e5",
        "& p": {
          m: 0,
          color: "#312e81",
          fontWeight: 500,
          lineHeight: 1.7,
          fontSize: "0.975rem",
        },
      }}
      {...props}
    >
      {children}
    </Paper>
  ),
  pre: ({ children, ...props }) => (
    <Box
      component="pre"
      sx={{
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        my: 2.5,
        overflowX: "auto",
        border: "1px solid #1e293b",
        boxShadow: "0 8px 16px -2px rgba(15, 23, 42, 0.2)",
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Monaco, Consolas, monospace",
        fontSize: { xs: "0.85rem", sm: "0.9rem" },
        lineHeight: 1.65,
        "& code": {
          backgroundColor: "transparent",
          p: 0,
          color: "inherit",
          border: "none",
          fontSize: "inherit",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className && !String(children).includes("\n");
    if (isInline) {
      return (
        <Box
          component="code"
          sx={{
            backgroundColor: "rgba(79, 70, 229, 0.08)",
            color: "#4338ca",
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Monaco, Consolas, monospace",
            fontWeight: 600,
            fontSize: "0.875em",
            px: 0.8,
            py: 0.25,
            borderRadius: 1,
            border: "1px solid rgba(79, 70, 229, 0.18)",
          }}
          {...props}
        >
          {children}
        </Box>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  ul: ({ children, ...props }) => (
    <Box
      component="ul"
      sx={{
        pl: 3,
        my: 2,
        "& li": {
          mb: 0.8,
          color: "#334155",
          lineHeight: 1.75,
          fontSize: "1rem",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  ol: ({ children, ...props }) => (
    <Box
      component="ol"
      sx={{
        pl: 3,
        my: 2,
        "& li": {
          mb: 0.8,
          color: "#334155",
          lineHeight: 1.75,
          fontSize: "1rem",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  ),
  strong: ({ children, ...props }) => (
    <Box
      component="strong"
      sx={{ fontWeight: 700, color: "#0f172a" }}
      {...props}
    >
      {children}
    </Box>
  ),
  hr: ({ ...props }) => (
    <Box
      component="hr"
      sx={{
        border: "none",
        borderTop: "1px solid #e2e8f0",
        my: 3,
      }}
      {...props}
    />
  ),
};

const Home = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [copiedLesson, setCopiedLesson] = useState(false);
  const [copiedQuiz, setCopiedQuiz] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const lessonRef = useRef(null);
  const quizRef = useRef(null);

  // Redux state
  const lesson = useSelector((state) => state.lesson.lesson);
  const lessonStatus = useSelector((state) => state.lesson.status);
  const lessonError = useSelector((state) => state.lesson.error);

  const quizzes = useSelector((state) => state.quiz.quizzes);
  const quizStatus = useSelector((state) => state.quiz.status);
  const quizError = useSelector((state) => state.quiz.error);

  // Derive metrics during rendering per vercel-react-best-practices (rerender-derived-state-no-effect)
  const lessonMetrics = useMemo(() => {
    if (!lesson) return { wordCount: 0, readTimeMinutes: 1 };
    const words = lesson.trim().split(/\s+/).filter(Boolean).length;
    return {
      wordCount: words,
      readTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    };
  }, [lesson]);

  useEffect(() => {
    if (lessonStatus === "streaming" && lessonRef.current) {
      lessonRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [lessonStatus, lesson]);

  useEffect(() => {
    if (quizStatus === "streaming" && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [quizStatus, quizzes]);

  const handleGenerateLesson = (customTopic) => {
    const topicToUse = typeof customTopic === "string" ? customTopic : input;
    if (topicToUse.trim()) {
      dispatch(resetLesson());
      dispatch(resetQuizzes());
      const prompt = buildLessonPrompt(topicToUse.trim());
      dispatch(generateLesson(prompt));
    }
  };

  const handleSelectSuggested = (topic) => {
    setInput(topic);
    handleGenerateLesson(topic);
  };

  const handleGenerateQuizzes = () => {
    if (lesson) {
      dispatch(resetQuizzes());
      dispatch(generateQuizzes(lesson));
    }
  };

  const handleClearAll = () => {
    setInput("");
    dispatch(resetLesson());
    dispatch(resetQuizzes());
  };

  const handleCopy = async (text, setCopiedState) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      handleGenerateLesson();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79, 70, 229, 0.08), transparent 70%), radial-gradient(ellipse 60% 40% at 95% 30%, rgba(6, 182, 212, 0.06), transparent 70%)",
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Header */}
        <Box textAlign="center" mb={{ xs: 4, sm: 6 }}>
          <Chip
            icon={<SparkleIcon sx={{ fontSize: "1rem !important", color: "#4f46e5" }} />}
            label="AI Learning Studio"
            size="small"
            sx={{
              mb: 2.5,
              py: 1.6,
              px: 1,
              bgcolor: "rgba(79, 70, 229, 0.08)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              color: "#4f46e5",
              fontWeight: 700,
              fontSize: "0.8rem",
            }}
          />
          <Typography
            variant={isMobile ? "h4" : "h2"}
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              mb: 1.5,
            }}
          >
            What would you like to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              master today?
            </span>
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              color: "text.secondary",
              maxWidth: 640,
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Enter any language, concept, technology, or topic to generate a
            comprehensive curriculum with data tables, diagrams, and quizzes.
          </Typography>
        </Box>

        {/* Input & Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: { xs: 4, sm: 5 },
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow:
              "0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.02)",
          }}
        >
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Enter a topic to learn about"
              placeholder="e.g., Quantum Computing, Spanish Subjunctive, Distributed Systems..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              InputProps={{
                sx: {
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  borderRadius: 3,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SparkleIcon sx={{ color: "primary.main", fontSize: 22 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Quick Inspiration Chips */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  display: "block",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Or choose a popular topic:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {SUGGESTED_TOPICS.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    onClick={() => handleSelectSuggested(topic)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: "grey.50",
                      border: "1px solid #e2e8f0",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "rgba(79, 70, 229, 0.08)",
                        borderColor: "primary.light",
                        color: "primary.main",
                      },
                      transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Feature Pills */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ pt: 0.5 }}
            >
              <Chip
                icon={<TableIcon fontSize="small" />}
                label="Comparison Tables"
                size="small"
                variant="outlined"
                color="primary"
                sx={{ bgcolor: "background.paper" }}
              />
              <Chip
                icon={<ChartIcon fontSize="small" />}
                label="Flowcharts & Diagrams"
                size="small"
                variant="outlined"
                color="primary"
                sx={{ bgcolor: "background.paper" }}
              />
              <Chip
                icon={<TipIcon fontSize="small" />}
                label="Pro-Tips & Callouts"
                size="small"
                variant="outlined"
                color="primary"
                sx={{ bgcolor: "background.paper" }}
              />
              <Chip
                icon={<CodeIcon fontSize="small" />}
                label="Code & Syntax"
                size="small"
                variant="outlined"
                color="primary"
                sx={{ bgcolor: "background.paper" }}
              />
            </Stack>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", pt: 1 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  lessonStatus === "loading" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <BookIcon />
                  )
                }
                onClick={() => handleGenerateLesson()}
                disabled={!input.trim() || lessonStatus === "loading"}
                fullWidth={isMobile}
                sx={{
                  py: { xs: 1.5, sm: 1.8 },
                  px: { xs: 3, sm: 4.5 },
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  fontWeight: 700,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  boxShadow: "0 6px 20px -4px rgba(79, 70, 229, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4338ca 0%, #0891b2 100%)",
                    boxShadow: "0 8px 24px -4px rgba(79, 70, 229, 0.5)",
                  },
                }}
              >
                {lessonStatus === "loading"
                  ? lessonStatus === "streaming"
                    ? "Generating Lesson in Real-Time..."
                    : "Connecting to AI..."
                  : "Generate Lesson"}
              </Button>

              {lesson ? (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  startIcon={<ResetIcon />}
                  onClick={handleClearAll}
                  sx={{
                    borderColor: "divider",
                    color: "text.secondary",
                    borderRadius: 3,
                    py: { xs: 1.5, sm: 1.8 },
                    px: 3,
                  }}
                >
                  Clear
                </Button>
              ) : null}
            </Box>

            {lessonError ? (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {lessonError}
              </Alert>
            ) : null}
          </Stack>
        </Paper>

        {/* Lesson Display Card */}
        {lesson || lessonStatus === "loading" ? (
          <Card
            elevation={0}
            sx={{
              mb: { xs: 4, sm: 5 },
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              boxShadow:
                "0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.02)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
              {/* Toolbar */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                  pb: 2,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: "rgba(79, 70, 229, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                  >
                    <BookIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      component="h2"
                      fontWeight="800"
                      color="#0f172a"
                    >
                      Structured Lesson
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comprehensive educational material formatted in rich GFM
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  {lessonMetrics.wordCount > 0 ? (
                    <Chip
                      icon={<TimerIcon fontSize="small" />}
                      label={`~${lessonMetrics.readTimeMinutes} min read (${lessonMetrics.wordCount} words)`}
                      size="small"
                      sx={{ bgcolor: "grey.100", fontWeight: 600 }}
                    />
                  ) : null}

                  {lesson ? (
                    <Tooltip title={copiedLesson ? "Copied!" : "Copy Markdown"}>
                      <IconButton
                        onClick={() => handleCopy(lesson, setCopiedLesson)}
                        size="small"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          color: copiedLesson ? "success.main" : "text.secondary",
                        }}
                      >
                        {copiedLesson ? (
                          <CheckIcon fontSize="small" />
                        ) : (
                          <CopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
              </Box>

              {/* Lesson Markdown Container */}
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  bgcolor: "#ffffff",
                  borderLeft: 4,
                  borderLeftColor: "primary.main",
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                }}
              >
                <Box
                  ref={lessonRef}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {(lesson || "").replace(/undefined/g, "")}
                  </ReactMarkdown>
                </Box>

                {lessonStatus === "streaming" ? (
                  <Stack direction="row" alignItems="center" spacing={1.5} mt={3}>
                    <CircularProgress size={18} sx={{ color: "primary.main" }} />
                    <Chip
                      label="AI is generating live stream..."
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                ) : null}
              </Paper>

              {/* Generate Quiz Callout Banner */}
              <Box
                mt={4}
                p={{ xs: 2.5, sm: 3 }}
                sx={{
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    color="#065f46"
                  >
                    Ready to test your knowledge?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate an interactive 5-question multiple choice assessment
                    customized to this lesson.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    quizStatus === "loading" ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <QuizIcon />
                    )
                  }
                  onClick={handleGenerateQuizzes}
                  disabled={!lesson || quizStatus === "loading"}
                  sx={{
                    py: 1.4,
                    px: 3.5,
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    },
                  }}
                >
                  {quizStatus === "loading"
                    ? quizStatus === "streaming"
                      ? "Generating Assessment..."
                      : "Connecting..."
                    : "Generate Quiz"}
                </Button>
              </Box>

              {quizError ? (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {quizError}
                </Alert>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {/* Quiz Display Card */}
        {quizzes || quizStatus === "loading" ? (
          <Card
            elevation={0}
            sx={{
              mb: { xs: 4, sm: 5 },
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              boxShadow:
                "0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.02)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                  pb: 2,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "success.main",
                    }}
                  >
                    <QuizIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      component="h2"
                      fontWeight="800"
                      color="#0f172a"
                    >
                      Knowledge Assessment
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5 multiple-choice questions to test retention
                    </Typography>
                  </Box>
                </Stack>

                {quizzes ? (
                  <Tooltip title={copiedQuiz ? "Copied!" : "Copy Quiz"}>
                    <IconButton
                      onClick={() => handleCopy(quizzes, setCopiedQuiz)}
                      size="small"
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        color: copiedQuiz ? "success.main" : "text.secondary",
                      }}
                    >
                      {copiedQuiz ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <CopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  bgcolor: "#ffffff",
                  borderLeft: 4,
                  borderLeftColor: "success.main",
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                }}
              >
                <Box
                  ref={quizRef}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {(quizzes || "").replace(/undefined/g, "")}
                  </ReactMarkdown>
                </Box>

                {quizStatus === "streaming" ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    mt={3}
                  >
                    <CircularProgress size={18} color="success" />
                    <Chip
                      label="AI is streaming quiz questions..."
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                ) : null}
              </Paper>
            </CardContent>
          </Card>
        ) : null}

        {/* Empty State Showcase */}
        {!lesson && lessonStatus !== "loading" ? (
          <Box sx={{ mt: 4, mb: 6 }}>
            <Typography
              variant="subtitle2"
              textAlign="center"
              color="text.secondary"
              sx={{
                mb: 3,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              How LinguistIQ Works
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{ color: "primary.main", mb: 1 }}
                  >
                    01
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>
                    Enter Any Topic
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type a topic or pick an inspiration pill to initiate instant AI
                    curriculum generation.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{ color: "secondary.main", mb: 1 }}
                  >
                    02
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>
                    Structured Generation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive comprehensive lessons with GFM comparison tables,
                    ASCII flowcharts, and pro-tips.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{ color: "success.main", mb: 1 }}
                  >
                    03
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>
                    Validate & Retain
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate an interactive 5-question assessment directly from the
                    lesson to verify your retention.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default Home;

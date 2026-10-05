import { useState, useRef, useEffect } from "react";
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
  Divider,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  School as SchoolIcon,
  MenuBook as BookIcon,
  Quiz as QuizIcon,
  Psychology as BrainIcon,
  TableChart as TableIcon,
  AutoGraph as ChartIcon,
  Lightbulb as TipIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { generateLesson, resetLesson } from "../app/slices/lessonSlice";
import { generateQuizzes, resetQuizzes } from "../app/slices/quizSlice";

// Rules for generating structured lessons with tables, charts/diagrams, and rich markdown
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
        fontSize: { xs: "1.6rem", sm: "2.1rem" },
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
        color: "#1e3a8a",
        fontSize: { xs: "1.3rem", sm: "1.5rem" },
        letterSpacing: "-0.015em",
        mt: 3.5,
        mb: 2,
        pb: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
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
        fontSize: { xs: "1.1rem", sm: "1.25rem" },
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
        fontSize: { xs: "0.95rem", sm: "1.05rem" },
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
        borderRadius: 2,
        border: "1px solid #cbd5e1",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          minWidth: 520,
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
        backgroundColor: "#f1f5f9",
        borderBottom: "2px solid #94a3b8",
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
        fontSize: "0.875rem",
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
        borderLeft: "4px solid #2563eb",
        background: "linear-gradient(90deg, #eff6ff 0%, #f8fafc 100%)",
        py: 1.5,
        px: 2.5,
        my: 2.5,
        borderRadius: "0 8px 8px 0",
        border: "1px solid #dbeafe",
        borderLeftWidth: 4,
        borderLeftColor: "#2563eb",
        "& p": {
          m: 0,
          color: "#1e3a8a",
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
        borderRadius: 2,
        p: { xs: 2, sm: 2.5 },
        my: 2.5,
        overflowX: "auto",
        border: "1px solid #1e293b",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
            backgroundColor: "rgba(37, 99, 235, 0.08)",
            color: "#1d4ed8",
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Monaco, Consolas, monospace",
            fontWeight: 600,
            fontSize: "0.875em",
            px: 0.8,
            py: 0.25,
            borderRadius: 1,
            border: "1px solid rgba(37, 99, 235, 0.2)",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const lessonRef = useRef(null);
  const quizRef = useRef(null);

  // Lesson state
  const lesson = useSelector((state) => state.lesson.lesson);
  const lessonStatus = useSelector((state) => state.lesson.status);
  const lessonError = useSelector((state) => state.lesson.error);

  // Quiz state
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const quizStatus = useSelector((state) => state.quiz.status);
  const quizError = useSelector((state) => state.quiz.error);

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

  const handleGenerateLesson = () => {
    if (input.trim()) {
      dispatch(resetLesson());
      dispatch(resetQuizzes());
      const prompt = buildLessonPrompt(input.trim());
      dispatch(generateLesson(prompt));
    }
  };

  const handleGenerateQuizzes = () => {
    if (lesson) {
      dispatch(resetQuizzes());
      dispatch(generateQuizzes(lesson));
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 4, sm: 6 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            mb={2}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
              }}
            >
              <BrainIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Avatar>
            <Typography
              variant={isMobile ? "h3" : "h2"}
              component="h1"
              fontWeight="bold"
              color="text.primary"
            >
              LinguistIQ
            </Typography>
          </Stack>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            maxWidth="600px"
            mx="auto"
          >
            Generate personalized lessons and quizzes powered by AI
          </Typography>
        </Box>

        {/* Input Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Enter a topic to learn about"
              placeholder="e.g., Machine Learning, English Grammar, World History..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              InputProps={{
                sx: { fontSize: { xs: "1rem", sm: "1.1rem" } },
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 0.5 }}
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

            <Box>
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
                onClick={handleGenerateLesson}
                disabled={!input.trim() || lessonStatus === "loading"}
                fullWidth={isMobile}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 4 },
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #1cb5e0 90%)",
                  },
                }}
              >
                {lessonStatus === "loading"
                  ? lessonStatus === "streaming"
                    ? "Generating..."
                    : "Loading..."
                  : "Generate Lesson"}
              </Button>

              {lessonError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {lessonError}
                </Alert>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* Lesson Display */}
        {(lesson || lessonStatus === "loading") && (
          <Card
            elevation={3}
            sx={{
              mb: { xs: 3, sm: 4 },
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <BookIcon />
                </Avatar>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h2"
                  fontWeight="bold"
                >
                  Generated Lesson
                </Typography>
              </Stack>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  bgcolor: "#ffffff",
                  borderLeft: 4,
                  borderLeftColor: "primary.main",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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
                {lessonStatus === "streaming" && (
                  <Stack direction="row" alignItems="center" spacing={1} mt={3}>
                    <CircularProgress size={16} />
                    <Chip
                      label="AI is generating..."
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                )}
              </Paper>

              {/* Generate Quiz Button */}
              <Box mt={4} pt={3}>
                <Divider sx={{ mb: 3 }} />
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
                  fullWidth={isMobile}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    fontWeight: 600,
                    background:
                      "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
                    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)",
                    },
                  }}
                >
                  {quizStatus === "loading"
                    ? quizStatus === "streaming"
                      ? "Generating..."
                      : "Loading..."
                    : "Generate Quiz"}
                </Button>

                {quizError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {quizError}
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Quiz Display */}
        {(quizzes || quizStatus === "loading") && (
          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: "success.light" }}>
                  <QuizIcon />
                </Avatar>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h2"
                  fontWeight="bold"
                >
                  Generated Quiz
                </Typography>
              </Stack>

              <Box>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    bgcolor: "#ffffff",
                    borderLeft: 4,
                    borderLeftColor: "success.main",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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
                  {quizStatus === "streaming" && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mt={3}
                    >
                      <CircularProgress size={16} color="success" />
                      <Chip
                        label="AI is generating..."
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                  )}
                </Paper>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!lesson && lessonStatus !== "loading" && (
          <Box textAlign="center" py={{ xs: 6, sm: 8 }}>
            <Avatar
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                bgcolor: "primary.light",
                mx: "auto",
                mb: 3,
              }}
            >
              <SchoolIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />
            </Avatar>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h3"
              fontWeight="medium"
              mb={2}
            >
              Ready to start learning?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth="400px"
              mx="auto"
            >
              Enter any topic above and let our AI generate a personalized
              lesson and quiz for you.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;

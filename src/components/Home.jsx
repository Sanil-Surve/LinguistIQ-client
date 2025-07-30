import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/icons-material";
import { generateLesson, resetLesson } from "../app/slices/lessonSlice";
import { generateQuizzes, resetQuizzes } from "../app/slices/quizSlice";

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
      dispatch(generateLesson(input));
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

  // Format lesson content with markdown support
  const formatLessonContent = (content) => {
    if (!content || typeof content !== "string") return "";
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^/, "<p>")
      .replace(/$/, content.endsWith("</p>") ? "" : "</p>")
      .replace(/undefined/g, "")
      .trim();
  };

  // Format quiz content with proper line breaks
  const formatQuizContent = (content) => {
    if (!content) return "";
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line.replace(/undefined/g, "").trim()}
        <br />
      </span>
    ));
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
                  p: { xs: 2, sm: 3 },
                  bgcolor: "grey.50",
                  borderLeft: 4,
                  borderLeftColor: "primary.main",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    color: "text.primary",
                    lineHeight: 1.7,
                    "& p": { mb: 2 },
                    "& strong": { fontWeight: 600 },
                    "& em": { fontStyle: "italic" },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatLessonContent(lesson),
                  }}
                  ref={lessonRef}
                />
                {lessonStatus === "streaming" && (
                  <Stack direction="row" alignItems="center" spacing={1} mt={2}>
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

              <Box ref={quizRef}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, sm: 3 },
                    background:
                      "linear-gradient(45deg, #e8f5e8 30%, #f3e5f5 90%)",
                    borderLeft: 4,
                    borderLeftColor: "success.main",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      color: "text.primary",
                      lineHeight: 1.7,
                    }}
                  >
                    {formatQuizContent(quizzes)}
                  </Box>
                  {quizStatus === "streaming" && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mt={2}
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

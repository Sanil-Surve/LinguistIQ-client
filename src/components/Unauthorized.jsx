import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Stack,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Google as GoogleIcon,
  TableChart as TableIcon,
  AutoGraph as ChartIcon,
  Quiz as QuizIcon,
  Bolt as FastIcon,
  ShieldOutlined as SecureIcon,
} from "@mui/icons-material";
import { auth, provider } from "./firebase";
import { setUser } from "../app/slices/authSlice";

// Hoist static feature list per vercel-react-best-practices (rendering-hoist-jsx)
const FEATURES = [
  {
    icon: <TableIcon sx={{ fontSize: 28, color: "#4f46e5" }} />,
    title: "Smart Comparison Tables",
    description:
      "Deep comparative matrices, parameter references, and pros/cons tables structured in clean Markdown.",
    badge: "Markdown GFM",
  },
  {
    icon: <ChartIcon sx={{ fontSize: 28, color: "#06b6d4" }} />,
    title: "Visual Flowcharts & Diagrams",
    description:
      "ASCII workflows and concept hierarchies that make complex architectures immediately understandable.",
    badge: "Architectural",
  },
  {
    icon: <QuizIcon sx={{ fontSize: 28, color: "#10b981" }} />,
    title: "Interactive AI Quizzes",
    description:
      "Test retention with instant 5-question assessments tailored dynamically to your generated lesson.",
    badge: "Self-Testing",
  },
];

const Unauthorized = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await auth.signInWithPopup(provider);
      dispatch(setUser(result.user));
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79, 70, 229, 0.15), transparent 70%), radial-gradient(ellipse 60% 40% at 90% 40%, rgba(6, 182, 212, 0.1), transparent 70%)",
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 820,
            mx: "auto",
            mb: { xs: 6, sm: 8 },
          }}
        >
          <Chip
            icon={<FastIcon sx={{ fontSize: "1rem !important", color: "#4f46e5" }} />}
            label="Powered by Groq & LLaMA 3.3 70B"
            size="small"
            sx={{
              mb: 3,
              py: 1.8,
              px: 1,
              bgcolor: "rgba(79, 70, 229, 0.08)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              color: "#4f46e5",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          />

          <Typography
            variant={isMobile ? "h4" : "h2"}
            component="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              mb: 3,
            }}
          >
            Master Any Topic with Intelligent,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Real-Time AI Lessons
            </span>
          </Typography>

          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              color: "text.secondary",
              lineHeight: 1.65,
              fontWeight: 400,
              mb: 4.5,
              maxWidth: 680,
              mx: "auto",
            }}
          >
            Generate comprehensive structured educational guides equipped with
            GFM comparison tables, visual architectural flowcharts, and
            knowledge-check quizzes in seconds.
          </Typography>

          {/* Primary CTA */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              onClick={handleSignIn}
              disabled={loading}
              sx={{
                py: { xs: 1.75, sm: 2 },
                px: { xs: 4, sm: 5 },
                fontSize: { xs: "1rem", sm: "1.05rem" },
                fontWeight: 700,
                borderRadius: 3,
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4338ca 0%, #3730a3 100%)",
                  boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.5)",
                },
              }}
            >
              {loading ? "Signing in..." : "Continue with Google to Start Learning"}
            </Button>
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 2.5,
              color: "text.secondary",
              fontSize: "0.85rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SecureIcon sx={{ fontSize: 16, color: "success.main" }} />
              <span>Free & Secure Authentication</span>
            </Box>
            <span>•</span>
            <span>No credit card required</span>
          </Box>
        </Box>

        {/* Feature Cards Grid */}
        <Grid container spacing={3.5} sx={{ mb: 6 }}>
          {FEATURES.map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  height: "100%",
                  borderRadius: 4,
                  bgcolor: "#ffffff",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                  boxShadow:
                    "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
                  transition: "all 0.25s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 12px 30px -4px rgba(79, 70, 229, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.05)",
                    borderColor: "rgba(79, 70, 229, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: "rgba(79, 70, 229, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Chip
                    label={feature.badge}
                    size="small"
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      bgcolor: "grey.100",
                      color: "text.secondary",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.65 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Unauthorized;

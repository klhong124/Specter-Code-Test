import { Box, Button, Center, Heading, Image, Text, useColorModeValue } from "@chakra-ui/react";
import type { Route } from "./+types/home";
import { HiArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(0, 0, 0, 0.6)");
  const textColor = useColorModeValue("gray.500", "whiteAlpha.700");
  return (
    <Center
      minH="100dvh"
      bgImage="url(bg.png)"
      bgSize="cover"
      bgPosition="center"
      pos="relative"
      zIndex={0}
      _before={{
        content: '""',
        pos: "absolute",
        inset: 0,
        bgColor: overlayBg,
        zIndex: -1,
      }}
    >
      <Box textAlign="center">
        <Image src="/specter-icon.svg" alt="Specter" w={12} mx="auto" mb={4} />
        <Heading
          mb={1}
          fontWeight="semibold"
          letterSpacing="tight"
          as={motion.h1}
          initial={{
            opacity: 0,
            y: 24,
            filter: "blur(12px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
        >
          Hey there!
        </Heading>
        <Text color={textColor} fontSize="sm" mb={4} letterSpacing="tight">
          Welcome to the Specter frontend test.
        </Text>
        <Button
          variant="outline"
          rightIcon={<HiArrowRight />}
          as={Link}
          to="/test"
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          rightIcon={<HiArrowRight />}
          as={Link}
          to="/companies"
          ml={2}
        >
          View Companies
        </Button>
      </Box>
    </Center>
  );
}

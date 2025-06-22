import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Image,
  Link as ChakraLink,
  ListItem,
  Tag,
  Text,
  UnorderedList,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const Page = () => {
  const bgGradient = useColorModeValue(
    "linear(to-b, rgba(255, 255, 255, 0.6), white)",
    "linear(to-b, rgba(0, 0, 0, 0.6), black)"
  );
  const containerBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)");
  const containerBorder = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.500", "whiteAlpha.700");
  const headingColor = useColorModeValue("gray.600", "whiteAlpha.800");
  const boxBorderColor = useColorModeValue("gray.100", "gray.700");
  const tagBgColor = useColorModeValue("gray.50", "gray.700");
  const tagBorderColor = useColorModeValue("gray.100", "gray.600");
  const logoFilter = useColorModeValue("none", "brightness(0) invert(1)");

  return (
    <Box
      bgImage="url(bg.png)"
      bgSize="cover"
      bgPosition="center"
      pos="relative"
      zIndex={0}
      _before={{
        content: '""',
        pos: "absolute",
        inset: 0,
        bgGradient: bgGradient,
        top: -12,
        zIndex: -1,
      }}
    >
      <Center>
        <Button
          variant="ghost"
          as={Link}
          to="/"
          _hover={{
            bg: "transparent",
          }}
          my={12}
        >
          <Image src="/specter.svg" alt="Specter" h={8} filter={logoFilter} />
        </Button>
      </Center>
      <Container
        as={motion.div}
        initial={{ opacity: 0, y: 12, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        maxW="600px"
        mb={24}
        bgColor={containerBg}
        backdropFilter="blur(12px)"
        rounded="2xl"
        borderWidth={1}
        borderColor={containerBorder}
        p={10}
        shadow="xl"
      >
        <VStack align="start" spacing={5}>
          <Box>
            <Tag
              size="md"
              rounded="full"
              bgColor={tagBgColor}
              borderColor={tagBorderColor}
              borderWidth={1}
              mb={1}
            >
              Frontend Test
            </Tag>
            <Heading as="h1" fontWeight="semibold">
              Company Feed with Filters
            </Heading>
          </Box>

          <Text fontSize="sm" color={textColor}>
            Welcome! This test is designed to evaluate your ability to work with
            a modern full-stack setup and your approach to building clean,
            interactive interfaces. The project is already configured with React
            Router v7, Chakra UI v2, React Query, and Prisma. A remote database
            connection is already set up — you do not need to configure or seed
            a local database.
          </Text>

          <Text fontSize="sm" color={textColor}>
            Your task is to create a new route and page that lists companies
            retrieved from the database via an API endpoint that you will build
            using Prisma. You'll then add filtering and sorting functionality as
            described below.
          </Text>

          <Box p={8} borderWidth={1} borderColor={boxBorderColor} borderRadius="lg">
            <Heading size="sm" mb={4}>
              ✅ Step 1 – Create an Endpoint and Set Up the Page
            </Heading>

            <UnorderedList fontSize="sm" color={textColor}>
              <ListItem>
                Create a new API route (e.g. /api/companies) that uses Prisma to
                fetch company data from the remote database.
              </ListItem>
              <ListItem>
                Then, create a new frontend route and page (e.g. /companies)
                that uses React Query to fetch from this API.
              </ListItem>
              <ListItem>
                Display the list of companies using Chakra UI in a clean,
                user-friendly way.
              </ListItem>
            </UnorderedList>
          </Box>

          <Box p={8} borderWidth={1} borderColor={boxBorderColor} borderRadius="lg">
            <Heading size="sm" color={headingColor} mb={4}>
              🔍 Step 2 – Design an Intuitive Filter Experience
            </Heading>
            <Text fontSize="sm" color={textColor} mb={4}>
              Our current filtering system creates too much friction for users. We need a more intuitive and user-friendly approach that makes filtering feel natural and effortless. Think about how users naturally search and filter in modern applications - they often start with a simple search and then refine their results.
            </Text>
            <Text fontSize="sm" color={textColor} mb={4}>
              For this prototype, focus on creating a seamless filtering experience that feels natural to use. Consider implementing a unified search experience where users can:
            </Text>
            <UnorderedList fontSize="sm" color={textColor}>
              <ListItem>
                Start with a smart search that understands company names, domains, and other attributes
              </ListItem>
              <ListItem>
                Easily refine results through intuitive UI patterns (like chips, tags, or quick filters)
              </ListItem>
              <ListItem>
                See their active filters clearly and be able to modify or remove them effortlessly
              </ListItem>
            </UnorderedList>
            <Text fontSize="sm" color={textColor} mt={4} mb={4}>
              The following filters should be available, but think creatively about how to make them accessible without overwhelming the user:
            </Text>
            <UnorderedList fontSize="sm" color={textColor}>
              <ListItem>
                Company name and domain search
              </ListItem>
              <ListItem>
                Rank (numeric comparison)
              </ListItem>
              <ListItem>
                Growth stage (seed, growing, late, exit, early)
              </ListItem>
              <ListItem>
                Customer focus (b2b, b2c, b2b_b2c, b2c_b2b)
              </ListItem>
              <ListItem>
                Last funding amount (USD)
              </ListItem>
              <ListItem>
                Last funding type (Angel, Convertible Note, etc.)
              </ListItem>
            </UnorderedList>
            <Text fontSize="sm" color={textColor} mt={4}>
              Remember: The goal is not to implement every possible filter combination, but to create an intuitive and delightful filtering experience that users will actually want to use.
            </Text>
          </Box>

          <Box p={8} borderWidth={1} borderColor={boxBorderColor} borderRadius="lg">
            <Heading size="sm" color={headingColor} mb={4}>
              ↕️ Step 3 – Sorting (Optional but encouraged)
            </Heading>
            <Text fontSize="sm" color={textColor}>
              Add simple sorting, e.g. by name or rank, in ascending or
              descending order.
            </Text>
          </Box>

          <Box p={8} borderWidth={1} borderColor={boxBorderColor} borderRadius="lg">
            <Heading size="sm" color={headingColor} mb={4}>
              🎨 Be Creative
            </Heading>
            <UnorderedList fontSize="sm" color={textColor}>
              <ListItem>
                You're encouraged to design the page with care — aim for good UX
                and visual clarity.
              </ListItem>
              <ListItem>
                Use Chakra UI, but don't be afraid to customize or extend
                components to match your vision.
              </ListItem>
              <ListItem>
                Showcase your creativity and thoughtfulness in how the UI feels
                to use.
              </ListItem>
            </UnorderedList>
          </Box>

          <Box p={8} borderWidth={1} borderColor={boxBorderColor} borderRadius="lg">
            <Heading size="sm" color={headingColor} mb={4}>
              🧠 Final Notes
            </Heading>
            <UnorderedList fontSize="sm" color={textColor}>
              <ListItem>
                Comment your code or add notes to explain your decisions and
                reasoning.
              </ListItem>
              <ListItem>
                Think aloud: how would you approach this differently in a
                production environment?
              </ListItem>
              <ListItem>
                What might you improve, modularize, or optimize for scalability?
              </ListItem>
              <ListItem>
                Feel free to include any enhancements or touches that show your
                attention to detail.
              </ListItem>
            </UnorderedList>
          </Box>

          <Box p={8} borderWidth={1} borderColor={boxBorderColor} borderRadius="lg">
            <Heading size="sm" color={headingColor} mb={4}>
              🔥 Hot Tip
            </Heading>
            <Text fontSize="sm" color={textColor}>
              Use this url to get company logos:
              <br />
              <ChakraLink
                href="https://app.tryspecter.com/logo?domain=google.com"
                color="brand.500"
                isExternal
              >
                https://app.tryspecter.com/logo?domain=google.com
              </ChakraLink>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Page;

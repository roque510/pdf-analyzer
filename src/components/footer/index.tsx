import { Box, Text, Center } from "@chakra-ui/react";
import Link from "next/link";

export default function Footer() {
  return (
    <Box as="footer" py={4} borderTop="1px solid" borderColor="gray.200">
      <Center>
        <Text fontSize="sm" color="gray.500">
          This SaaS is powered by{" "}
          <Link 
            href="https://armando-cv-five.vercel.app" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--chakra-colors-teal-500)', fontWeight: 500 }}
          >
            Armando Roque
          </Link>
        </Text>
      </Center>
    </Box>
  );
}
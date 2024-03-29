import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Stack,
  Heading,
  Button,
  Text,
  SimpleGrid,
  Box,
  HStack,
  Image,
  UnorderedList,
  ListItem,
  List,
  ListIcon,
  Link,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Center,
  Flex,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import {
  HiOutlineFlag,
  HiOutlineGlobe,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import { Trip } from "../types/types";
import { useRecoilState } from "recoil";
import { tripDetailsAtom } from "../atoms/trip-details.atom";

const BASE_URL =
  "https://trips-exploring-backend.netlify.app/.netlify/functions";

export const TripDetails = () => {
  const [tripDetails, setTripDetails] = useRecoilState(tripDetailsAtom);
  const [trip, setTrip] = useState<Trip | null>(null);
  const { id } = useParams();
  const tripId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const fetchTripDetails = async () => {
    if (tripId && tripDetails[tripId]) {
      setTrip(tripDetails[tripId]);
    } else if (tripId) {
      const response = await fetch(`${BASE_URL}/trip-details?id=${tripId}`);
      const tripResponse = (await response.json()) as Trip;
      setTripDetails({ ...tripDetails, [tripId]: tripResponse });
      setTrip(tripResponse);
    } else {
      //nothing else matterssssss :D
    }
  };

  useEffect(() => {
    fetchTripDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!trip) {
    return <div>Loading...</div>;
  }

  const advantagesIcons = [
    <HiOutlineFlag size="1.5rem" />,
    <HiOutlineGlobe size="1.5rem" />,
    <HiOutlineBriefcase size="1.5rem" />,
    <HiOutlineUserGroup size="1.5rem" />,
  ];

  return (
    <Stack py="2" px={["4", "12"]} backgroundColor="gray.200">
      <Link
        py={["1", "4"]}
        paddingBottom={["2", "10"]}
        textDecoration={"underline"}
        fontSize="xs"
        fontWeight={700}
        color="gray.500"
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </Link>
      <Heading py="0" fontSize="2xl" letterSpacing="wide">
        {trip.title}
      </Heading>
      <Text fontSize="xs" color="gray.600" fontWeight={500}>
        {trip.subtitle}
      </Text>
      <Grid
        templateColumns={["1fr", "2fr 1fr"]}
        gap={["2", "20"]}
        py={["2", "8"]}
      >
        <Box>
          <Box paddingBottom={["1", "4"]}>
            <Image
              width="100%"
              borderRadius={["xs", "2xl"]}
              src={trip.photoUrl}
              alt={trip.title}
            />
          </Box>
          <Heading py="4" fontSize="lg" letterSpacing="wide" color="gray.600">
            Overview
          </Heading>
          <Grid templateColumns="1fr 1fr" gap={["1", "10"]} py="2">
            {trip.advantages.map((a, i) => (
              <HStack alignItems="start" gap="2">
                <Box>{advantagesIcons[i]}</Box>
                <Stack gap={1}>
                  <Text fontWeight={700}>{a.title}</Text>
                  <Text fontSize="xs" color="gray.600" fontWeight={500}>
                    {a.description}
                  </Text>
                </Stack>
              </HStack>
            ))}
          </Grid>
          <Text py={["2", "10"]} color="gray.800">
            {trip.description}
          </Text>
        </Box>
        <Flex justifyContent="center" width="100%">
          <Card boxSize="xs" maxH="17rem">
            <CardHeader>
              <Heading size="md">{trip.days} days</Heading>
              <Text color="gray.600">
                Emmisions:{" "}
                {trip.co2kilograms < 1000
                  ? `${trip.co2kilograms.toFixed(0)} kg`
                  : `${(trip.co2kilograms / 1000).toFixed(1)} t`}{" "}
                CO<sub>2</sub>e
              </Text>
            </CardHeader>
            <Box px="4">
              <Divider />
            </Box>
            <CardBody>
              <Stack>
                <Text color="gray.600" fontWeight={600}>
                  Countries included:
                </Text>
                <Grid templateColumns={"1fr 1fr"}>
                  {trip.countries.map((c) => (
                    <UnorderedList key={c}>
                      <ListItem color="gray.600" fontWeight={400}>
                        {c}
                      </ListItem>
                    </UnorderedList>
                  ))}
                </Grid>
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </Grid>
    </Stack>
  );
};

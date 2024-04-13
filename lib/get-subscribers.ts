import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../config/firebase-config";

type Subscriber = {
  email: string;
  date_subscribed: string;
};
export const useGetSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  useEffect(() => {
    setSubscriberLoading(true);
    async function getAllDocs() {
      const subscriberRef = collection(database, "subscribers");
      const querySnapshot = await getDocs(subscriberRef);
      const subscribers: Subscriber[] = [];
      querySnapshot.forEach((doc) => {
        subscribers.push({
          date_subscribed: doc.data().date_subscribed,
          email: doc.data().email,
        });
      });
      subscribers.sort((a, b) =>
        a.date_subscribed < b.date_subscribed ? 1 : -1
      );
      setSubscribers(subscribers);
    }
    getAllDocs();
    setSubscriberLoading(false);
  }, []);
  return { subscribers, subscriberLoading };
};

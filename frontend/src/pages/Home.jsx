import { useEffect, useState } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../components/hooks/useWorkoutsContext";

const Home = () => {
  // const [workouts, setWorkouts] = useState(null)
  const { workouts, dispatch } = useWorkoutsContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      //For this to be able to fetch /api/workouts
      //have to add   "proxy": "http://localhost:4000/" to the package.json
      //so it knows that unkown request should direct to that url
      const response = await fetch("/api/workouts");
      const json = await response.json();

      if (response.ok) {
        // setWorkouts(json)
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };
    fetchWorkouts();
  }, [dispatch]);

  return (
    <div className="home">
      <div className="workouts">
        {workouts &&
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;

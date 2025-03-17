import { useRouter } from "next/router";

const EditTrack = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log("id: ", id);

  return <p>Test</p>;
};

export default EditTrack;

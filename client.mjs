import axios from "axios";

async function classifyImage(imageUrl) {
  try {
    const response = await axios.post("http://localhost:3000/classify", {
      imageUrl: imageUrl,
    });

    // console.log("Classification result:", response.data);
    console.log(
      `Classification result: ${
        response?.data[0]?.label
      }, Accuracy: ${Math.round(response?.data[0]?.score * 100)}%`
    );
  } catch (error) {
    console.error("Error classifying image:", error);
  }
}

const image1 = "https://i.imgur.com/fhtXyYJ.png";
const image2 =
  "https://img.freepik.com/premium-photo/brunette-woman-wearing-casual-attire-posing-with-toothy-smile_176532-10666.jpg?w=1060";
const image3 =
  "https://img.freepik.com/free-photo/indoor-shot-good-looking-puzzled-confused-young-male-with-dark-beard-feels-hesitant-raises-palms-with-bewilderment-says-maybe-yes-no-wears-casual-red-tshirt-isolated-white-wall_273609-16243.jpg?t=st=1719762578~exp=1719766178~hmac=843062b715725b55c1a1b59e68c426c30c51a0781a25d7a4121156b5dd5812ce&w=1060";

await classifyImage(image1);
await classifyImage(image2);
await classifyImage(image3);

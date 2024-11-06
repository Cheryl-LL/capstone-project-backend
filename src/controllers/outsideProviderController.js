const {
  getAllOutsideProviders,
  createOutsideProvider,
  getOutsideProviderById,
  updateOutsideProviderById,
  deleteOutsideProviderById,
  getOutsideProviderByEmail,
} = require("../models/outsideProviderModel");
const { getUserByEmail } = require("../models/userModel");

// Controller to get all outside providers
const getAllOutsideProvidersController = (req, res) => {
  getAllOutsideProviders((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
};

// Controller to create a new outside provider
const createOutsideProviderController = async (req, res) => {
  const provider = req.body;

  try {
    // Check for an existing provider by email
    const existingProvider = await getOutsideProviderByEmail(provider.email);

    // If a provider with the same email exists, return a conflict error
    if (existingProvider) {
      return res
        .status(409)
        .send({ message: "Provider with this email already exists." });
    }

    // If no duplicate, proceed with creation
    const createdProvider = await createOutsideProvider(provider);
    res.status(201).send(createdProvider);
  } catch (err) {
    console.error("Error in createOutsideProviderController:", err);
    res.status(500).send({ error: "An error occurred", details: err.message });
  }
};

// Controller to get a specific outside provider by ID
const getOutsideProviderByIdController = async (req, res) => {
  const { outsideProviderId } = req.params;
  try {
    const results = await getOutsideProviderById(outsideProviderId);
    if (!results) {
      return res.status(404).send("Outside provider not found");
    }
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Controller to update an outside provider by ID
const updateOutsideProviderByIdController = async (req, res) => {
  const { outsideProviderId } = req.params;
  const { email, ...otherFields } = req.body;

  try {
    const outsideProvider = await getOutsideProviderById(outsideProviderId);
    if (!outsideProvider) {
      return res.status(404).send({ error: "Outside Provider ID not found" });
    }

    if (email) {
      const outsideProviderWithEmail = await getOutsideProviderByEmail(email);
      if (
        outsideProviderWithEmail &&
        outsideProviderWithEmail.outsideProviderId != outsideProviderId
      ) {
        return res.status(400).send({ error: "Email already exists" });
      }
    }

    const updateResults = await updateOutsideProviderById(outsideProviderId, {
      email,
      ...otherFields,
    });
    res.status(200).send({
      message: "Outside provider updated successfully",
      data: updateResults,
    });
  } catch (err) {
    res.status(500).send({ error: "An error occurred", details: err.message });
  }
};

// Controller to delete an outside provider by ID
const deleteOutsideProviderController = async (req, res) => {
  const { outsideProviderId } = req.params;

  try {
    const results = await getOutsideProviderById(outsideProviderId);
    if (!results) {
      return res.status(404).send("Outside provider not found");
    }

    await deleteOutsideProviderById(outsideProviderId);
    res.status(200).send({ message: "Outside provider successfully deleted" });
  } catch (err) {
    res.status(500).send({ error: "An error occurred", details: err.message });
  }
};

module.exports = {
  getAllOutsideProvidersController,
  createOutsideProviderController,
  getOutsideProviderByIdController,
  updateOutsideProviderByIdController,
  deleteOutsideProviderController,
};

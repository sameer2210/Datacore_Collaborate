  import Company from "./companySchema.js";  


  // Create Company
  export async function createCompany(req, res) {
    try {
      const existingCompany = await Company.findOne({ userId: req.user.id });

      if (existingCompany) {
        return res.status(400).json({ message: "Company already exists", company: existingCompany });
      }

      const companyData = {
        ...req.body,
        userId: req.user.id,
      };

      const company = await Company.create(companyData);
      res.status(201).json({ company });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  // Get All Companies for Logged-in User
  export async function getAllCompanies(req, res) {
    try {
      //  Fetch companies for the logged-in user only
      const companies = await Company.find({ userId: req.user.id });
      res.json(companies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Read One
  export async function getCompanyById(req, res) {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) return res.status(404).json({ error: "Company not found" });
      res.json(company);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update
  export async function updateCompany(req, res) {
    try {
      const { id } = req.params;

      // Ensure the company belongs to the current user
      const company = await Company.findOne({ _id: id, userId: req.user.id });
      if (!company) {
        return res.status(404).json({ message: "Company not found or unauthorized" });
      }

      Object.assign(company, req.body); // update fields
      await company.save();

      res.status(200).json({ company });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // Delete
  export async function deleteCompany(req, res) {
    try {
      const deleted = await Company.findByIdAndDelete(req.params.id,userId);
      if (!deleted) return res.status(404).json({ error: "Company not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }






 
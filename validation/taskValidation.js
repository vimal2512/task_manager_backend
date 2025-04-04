import Joi from "joi";

// Task Validation Schema
export const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional(),
    status: Joi.string().valid("Todo", "In Progress", "Completed").optional(),
    assignedTo: Joi.alternatives().try(
      Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      Joi.allow(null) // Allow null if not assigned
    ).optional(),
  });

  return schema.validate(data, { stripUnknown: true });
};

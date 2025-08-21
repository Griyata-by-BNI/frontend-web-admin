const appendIfDefined = (fd: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  // boolean -> "true"/"false", number -> string
  if (typeof value === "boolean") fd.append(key, String(value));
  else if (typeof value === "number") fd.append(key, String(value));
  else fd.append(key, value as string);
};

export default appendIfDefined;

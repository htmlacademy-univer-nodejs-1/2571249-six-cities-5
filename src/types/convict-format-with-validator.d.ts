declare module "convict-format-with-validator" {
  import type { Format } from "convict";
  const convictFormatWithValidator: {
    ipaddress: Format;
    url: Format;
    email: Format;
  };
  export default convictFormatWithValidator;
}

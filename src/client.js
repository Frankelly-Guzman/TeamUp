import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API;

console.log("URL: ", supabaseUrl);
console.log("KEY: ", supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
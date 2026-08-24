import { createClient } from "@supabase/supabase-js";
import env from 'dotenv';

env.config();

const supabase = createClient(
    process.env.supabaseURL,
    process.env.supabaseAPI
);

export default supabase;
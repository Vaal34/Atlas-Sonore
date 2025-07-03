// Exports centralisés pour Supabase
export { createClient as createBrowserClient } from '@/utils/supabase/client'
export { createClient as createServerClient } from '@/utils/supabase/server'
export { updateSession } from '@/utils/supabase/middleware' 
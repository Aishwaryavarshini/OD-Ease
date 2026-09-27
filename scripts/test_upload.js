import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://envvlypkrqvdepkwbwfi.supabase.co';
const supabaseKey = 'sb_publishable_5sxMkcqz8ENMsBcqlVa2pg_A29Re-fT';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  const testData = [{ id: 'test-1', event: 'Test Shared Record', timestamp: Date.now() }];
  const blob = Buffer.from(JSON.stringify(testData, null, 2));

  console.log('Uploading test file to Supabase Storage...');
  const { data: uploadRes, error: uploadErr } = await supabase.storage
    .from('od_data')
    .upload('test_apps.json', blob, { contentType: 'application/json', upsert: true });

  if (uploadErr) {
    console.error('Upload Error:', uploadErr.message);
  } else {
    console.log('Upload Success:', uploadRes);

    // Now test downloading
    const { data: downloadData, error: downloadErr } = await supabase.storage
      .from('od_data')
      .download('test_apps.json');

    if (downloadErr) {
      console.error('Download Error:', downloadErr.message);
    } else {
      const text = await downloadData.text();
      console.log('Downloaded content:', text);
    }
  }
}

testUpload();

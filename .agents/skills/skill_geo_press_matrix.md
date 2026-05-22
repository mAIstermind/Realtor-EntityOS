Build a custom OpenClaw automation skill component named 'skill_geo_press_matrix.md' inside the workspace skills directory.

SKILL ARCHITECTURE DEFINITION:
1. INPUT TRIGGER: Configure the skill to listen to an incoming webhook or cron execution check every 6 hours. The agent must parse the Teable database base using the TEABLE_API_TOKEN to scan for records within the 'Property_Listings' table holding a status of 'Pending_GEO_Generation'.

2. INTENT BREAKDOWN STEP: For every target listing record identified, invoke the background model block via the Gemini API to pass the property parameters through a three-tier persona evaluation matrix: Yield Investor, Lifestyle Expat, and Fiduciary/Legal buyer.

3. PROGRAMMATIC COMPILATION: 
   - Auto-generate 3 distinct, highly targeted, information-dense Press Releases containing authoritative local market statistics, direct quote attributions from the Agent profile, and absolute link anchors pointing to the agent's '.reviews' landing page.
   - Compile 3 custom nested JSON-LD arrays containing 'FAQPage' and 'LocalBusiness' configurations matching each contextual persona.

4. WEBWIRE DISPATCH PIPELINE: Orchestrate an automated downstream POST request pushing the completed press release copy directly to a distribution wire API (e.g., Presswire) or an n8n webhook to instantly publish the earned media across the web. Update the master Teable record status field to 'GEO_Fully_Optimized' upon a successful 200 OK response stream.

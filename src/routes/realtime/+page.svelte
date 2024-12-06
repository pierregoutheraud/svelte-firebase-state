<h3>Realtime Database Integration</h3>
<p>
	NodeState: Manages a specific node in the Realtime Database, supporting
	fetching, live updates, and saving changes with optional autosave.
</p>
<p>
	NodeListState: Similar to NodeState but designed for lists of data stored as a
	map in the Realtime Database.
</p>

<p>4. User Awareness</p>
<p>
	Each class integrates Firebase Authentication, allowing queries or paths to be
	dynamically adjusted based on the current user's data or authentication state.
</p>

<p>5. Automatic Data Handling</p>

<p>Fetches data on-demand and subscribes to changes as needed.</p>
<p>Maintains an internal loading state for improved UI responsiveness.</p>
<p>
	Converts Firestore documents to structured objects, preserving document IDs.
</p>

# Synchronicity — Privacy Policy

**Effective date:** 16 November 2026  
**Last updated:** 16 November 2026

## 1. Introduction

Synchronicity is an independent video game.

This Privacy Policy explains what personal information is collected when you play Synchronicity, why it is collected, how it is processed and protected, how long it is retained, and the rights you may have regarding your information.

We aim to collect only the information reasonably necessary to understand game usage, measure playtime, and protect the game's online services from abuse.

**Data controller:** Raimond
**Location:** Estonia  
**Privacy contact:** synchronicitydev1@gmail.com

The data controller is responsible for deciding how and why personal information is processed.

## 2. Information We Collect

When you launch or play Synchronicity, we may collect and process the following information.

### 2.1 Player name

You may be asked to provide a player name. Providing a name is optional.

Your chosen name is associated with your anonymous player identifier and may be stored for as long as your player record is retained.

Please avoid entering sensitive personal information as your player name.

### 2.2 Anonymous player identifier

Synchronicity uses Supabase Anonymous Authentication to generate an identifier for your game installation or browser session history.

This identifier allows the game to associate multiple play sessions with the same player record.

It is not necessarily linked to your real-world identity, although it may still constitute personal data when combined with other information.

### 2.3 Approximate geographic location

Synchronicity estimates your country and city using your internet connection's IP address.

The resulting country and city may be stored in the player database.

This information is approximate and may be incorrect, particularly if you use a VPN, proxy, mobile network, or certain internet service providers.

Synchronicity does not request GPS location permission to provide this feature.

### 2.4 Play-session information

The game records information about your play sessions, including:

- Session start and end times.
- Playtime duration.
- Session activity and pause status.
- The time of the most recent session heartbeat.
- Technical session identifiers.

This information helps us understand game usage, measure activity, and maintain the reliability of session tracking.

### 2.5 IP addresses and technical information

When the game communicates with our backend, your IP address is processed to identify the approximate network location, apply abuse-prevention rate limits, and protect the service.

For approximate geolocation, the backend sends your IP address to IPinfo, a third-party IP geolocation provider.

Our application does not intentionally save your raw IP address in its `players` or `play_sessions` database tables. Network information may nevertheless be recorded in operational logs maintained by infrastructure providers under their respective practices.

The backend also creates a cryptographic network-derived value for rate limiting. Such values may remain personal data if they can be associated with a particular user or network.

## 3. Why We Process Information

We process personal information for the following purposes:

| Purpose | Information involved |
|---|---|
| Maintaining player sessions | Anonymous identifier, session status and timestamps |
| Measuring game usage | Session duration and activity history |
| Understanding approximate geographic distribution | Country and city |
| Identifying player records | Optional player name and anonymous identifier |
| Preventing abuse | IP-derived network information, player identifier and request activity |
| Maintaining security and reliability | Technical errors and operational information |

We do not use the application telemetry described here to sell personal information or create advertising profiles.

## 4. Legal Basis for Processing

Under Article 6(1)(f) of the General Data Protection Regulation (GDPR), processing may be lawful where it is necessary for legitimate interests pursued by the data controller, provided those interests are not overridden by the rights and freedoms of the individuals concerned.

Our proposed legitimate interests are:

- Maintaining the security and integrity of our online services.
- Preventing automated abuse and excessive requests.
- Measuring game usage so we can understand and improve Synchronicity.
- Maintaining reliable records of game sessions.

Where we rely on legitimate interests, we must assess whether the processing is necessary and proportionate, including its impact on players.

You have the right to object to processing based on legitimate interests, subject to the conditions provided by applicable law.

If a feature requires consent under applicable law, we will obtain that consent before performing the relevant processing.

## 5. Third-Party Service Providers

Synchronicity uses the following services.

### Supabase

Supabase provides anonymous authentication, database hosting, Edge Functions, and related infrastructure.

Supabase processes information on behalf of the application operator under its applicable data-processing arrangements.

Information processed through Supabase may include player identifiers, session records, player metadata, and technical service information.

Website: https://supabase.com  
Privacy Policy: https://supabase.com/privacy  
Data Processing Addendum: https://supabase.com/legal/customer-resources/data-processing-addendum

### IPinfo

IPinfo provides IP-based geographic information.

When your player session is created, our backend may submit your IP address to IPinfo to estimate your country and city.

IPinfo's geolocation information is an estimate and does not represent a verified physical location.

Website: https://ipinfo.io  
Privacy Policy: https://ipinfo.io/privacy-policy

We may disclose information where legally required, including in response to valid legal obligations.

## 6. Where Information Is Processed

Synchronicity uses third-party infrastructure that may process personal information in more than one country.

Supabase hosts core project data in the region selected by the project operator, but certain operational services, technical support, and processing activities may occur in other countries.

Supabase documents the use of Standard Contractual Clauses for relevant international transfers to locations including Singapore and the United States.

IPinfo may also process information outside the European Economic Area, depending on its operations and applicable arrangements.

Where required, international transfers must have a lawful transfer mechanism and appropriate protections.

Information about applicable transfer safeguards can be requested using the privacy contact provided above.

## 7. How Long Information Is Retained

We aim to retain personal information only as long as it is needed for the purposes described in this policy.

Our intended retention schedule is:

| Information | Retention |
|---|---|
| Completed play-session records | Up to 90 days after the session ends |
| Player name and geographic metadata | While the associated player record remains necessary |
| Anonymous player identifier | While the associated player account remains active or necessary |
| Operational and security logs | According to applicable provider retention periods and operational requirements |

Completed session records are intended to be removed through automated database cleanup.

Inactive player records and associated authentication accounts will be subject to a separate deletion procedure.

Deletion may not immediately remove information from backups or independently retained third-party operational logs. These are governed by applicable retention schedules and legal requirements.

We will review retained data periodically and delete information when it is no longer necessary.

## 8. How We Protect Information

We use technical and organizational measures intended to protect player information, including:

- Authenticated backend requests.
- Server-side verification of player identities.
- Session-ownership checks.
- Database Row Level Security.
- Restricted database permissions.
- Private server-side credentials.
- Network request rate limiting.
- Access restrictions on player and session records.

Ordinary players are not granted direct database permissions to view other players' telemetry records.

No internet-based system can guarantee absolute security. We review and update our protections when necessary.

## 9. Your Data Protection Rights

Under applicable data protection law, including the GDPR, you may have the right to:

- **Access:** Request information about the personal data we process concerning you.
- **Rectification:** Request correction of inaccurate personal information.
- **Erasure:** Request deletion of personal information where the legal conditions apply.
- **Restriction:** Request that certain processing be restricted.
- **Objection:** Object to processing based on legitimate interests, including certain analytical processing.
- **Data portability:** Receive qualifying personal data in a commonly used, machine-readable format where the legal conditions apply.

You may also withdraw consent at any time if any processing is based on consent. This does not invalidate processing lawfully performed before withdrawal.

To exercise your rights, contact:

**synchronicitydev1@gmail.com**

Because Synchronicity uses anonymous authentication, we may need to verify your control of the relevant game identifier or session before disclosing or deleting associated records.

Please do not send passwords or sensitive identification documents unless they are specifically necessary and securely requested.

We will respond within the time limits required by applicable law, generally within one month, subject to lawful extensions.

## 10. Deleting Your Player Information

You may request deletion of the personal information associated with your Synchronicity player record.

After verifying the request, we will review the relevant player metadata, play-session records, and associated anonymous authentication account for deletion, subject to any applicable legal exceptions.

Removing browser storage or uninstalling the game does not necessarily delete information previously transmitted to the backend.

For deletion requests, contact:

**synchronicitydev1@gmail.com**

## 11. Children and Young Players

Synchronicity may be played by younger users.

Where personal data is processed in relation to children, we take account of the additional protections required by applicable data protection laws.

If we become aware that information was collected or processed unlawfully, we will take appropriate steps to address the issue, including deletion where required.

Parents or legal guardians may contact us about privacy concerns relating to a child.

## 12. Cookies and Local Storage

Synchronicity may use browser local storage to maintain the anonymous authentication session, remember a player name, and preserve locally stored game preferences or settings.

This storage supports the game's operation and continuity.

The telemetry implementation described in this policy does not intentionally use third-party advertising cookies.

Applicable rules concerning storage on a user's device, including consent requirements and exemptions for strictly necessary storage, continue to apply.

## 13. Automated Decision-Making

Synchronicity uses automated technical checks for functions such as request rate limiting and session-state validation.

We do not currently use the telemetry system to make automated decisions that produce legal effects or similarly significant effects concerning players.

## 14. Changes to This Policy

We may update this Privacy Policy when Synchronicity's functionality, service providers, or data-processing practices change.

The updated policy will state its effective date.

Where legally required, we will provide additional notice or obtain consent before making material changes to relevant processing activities.

## 15. Complaints and Supervisory Authority

If you believe your personal information has been processed unlawfully, you may contact us using the privacy email above.

You also have the right to lodge a complaint with a competent data protection supervisory authority.

For Estonia, the supervisory authority is:

**Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)**

Website: https://www.aki.ee  
Email: info@aki.ee

You may also contact the supervisory authority in the European Union member state where you habitually reside, work, or where an alleged infringement occurred.

## 16. Contact

For any privacy-related questions, requests, or complaints concerning Synchronicity, contact:

**Data controller:** Raimond
**Country:** Estonia  
**Email:** synchronicitydev1@gmail.com

We aim to respond to privacy inquiries as promptly as reasonably possible and within applicable statutory time limits.
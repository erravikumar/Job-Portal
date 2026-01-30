import InputField from "components/InputField";

export default function Referrer({ referrer, addReferrer }) {
  return (
    <>
      <h2 className="mt-8 mb-4 text-4xl font-semibold text-gray-900 leading-none">
        Your contact information
      </h2>

      <InputField
        type="text"
        label="Your name"
        value={referrer.name ?? ""}
        onChange={(e) =>
          addReferrer({ ...referrer, name: e.target.value })
        }
        placeholder="Firstname Lastname"
      />

      <InputField
        type="text"
        label="Your current job title"
        value={referrer.title ?? ""}
        onChange={(e) =>
          addReferrer({ ...referrer, title: e.target.value })
        }
        placeholder="Developer at X"
      />

      <InputField
        type="email"
        label="Your email"
        value={referrer.email ?? ""}
        onChange={(e) =>
          addReferrer({ ...referrer, email: e.target.value })
        }
        placeholder="firstname@company.com"
      />

      <InputField
        type="text"
        label="Your LinkedIn profile url"
        value={referrer.linkedin ?? ""}
        onChange={(e) =>
          addReferrer({ ...referrer, linkedin: e.target.value })
        }
        placeholder="https://www.linkedin.com/in/firstname-lastname"
      />

      {/* Select */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          How did you know Job Portal?
        </label>

        <select
          className="block border border-gray-300 w-full p-3 rounded mb-4"
          value={referrer.source ?? ""}
          onChange={(e) =>
            addReferrer({ ...referrer, source: e.target.value })
          }
        >
          <option value="">Select an option</option>
          <option value="friends">Through friends</option>
          <option value="internet">Internet search</option>
          <option value="ads">Online advertising</option>
          <option value="event">Attended an event</option>
          <option value="school">School or community organization</option>
          <option value="advisor">Career advisor</option>
          <option value="blog">Blog or news website</option>
          <option value="forum">Online forums</option>
          <option value="tv">TV or radio</option>
          <option value="email">Email or message</option>
        </select>
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-2 text-black text-sm font-medium mt-8">
        <input
          type="checkbox"
          className="mt-1 text-primary"
          checked={!!referrer.accepted}
          onChange={(e) =>
            addReferrer({ ...referrer, accepted: e.target.checked })
          }
        />
        <span>
          I have read and agree to ITviec’s Terms & Conditions and Privacy Policy.
        </span>
      </label>
    </>
  );
}

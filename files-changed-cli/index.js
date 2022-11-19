#!/usr/bin/env node

import { execaCommand } from "execa";
import mri from "mri";

const FOLDERS = {
  auth: "auth",
  cart: "cart",
  infra: "infra/k8s",
};

const git = {
  base: (headRevision) => `git merge-base main ${headRevision}`,
  changedFiles: (mergeRevision, headRevision) =>
    `git diff --name-only ${mergeRevision} ${headRevision}`,
};

(async () => {
  const cliFlags = mri(process.argv.slice(2), {
    default: {
      "head-revision": process.env.CIRCLE_SHA1,
    },
  });

  const baseCmdResult = await execaCommand(git.base(cliFlags["head-revision"]));

  const mergeRevision = baseCmdResult.stdout;
  const changedFilesCmdResult = await execaCommand(
    git.changedFiles(mergeRevision, cliFlags["head-revision"])
  );

  const filesChanged = changedFilesCmdResult.stdout
    .split("\n")
    .map((filePath) => filePath.trim())
    .filter((filePath) => filePath.length > 0);

  if (FOLDERS[cliFlags.folder]) {
    const didFolderChange = filesChanged.some((file) =>
      file.startsWith(`${cliFlags.folder}/`)
    );

    process.stdout.write("true");
  }
})();

#!/usr/bin/env node

import { execaCommand } from "execa";
import mri from "mri";

// cli will receive folder and revision branch as arguments
// cli returns true if changed

const getFilesChanged = async () => {
  const cliFlags = mri(process.argv.slice(2));
  console.log(cliFlags);

  const filesChangedOutput = await execaCommand(
    "git diff --name-only main testing"
  );

  const filesChanged = filesChangedOutput.stdout
    .split("\n")
    .map((filePath) => filePath.trim())
    .filter((filePath) => filePath.length > 0);

  const authChanged = filesChanged.some((file) => file.startsWith("auth/"));
  const cartChanged = filesChanged.some((file) => file.startsWith("cart/"));
  const infraChanged = filesChanged.some((file) =>
    file.startsWith("infra/k8s/")
  );
};

getFilesChanged();

/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "odpady-harmonogram-bp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
      providers: { cloudflare: "6.13.0" },
    };
  },
  async run() {
    const ZONE_ID = "80cf2d2ab9772221bd9a1921279fe849";

    const pagesProject = new cloudflare.PagesProject("PagesOdpady", {
      accountId: "b8e5653e747f6ee4b79c9a3050d11ce1",
      name: "odpady-harmonogram-bp",
      productionBranch: "master",

      source: {
        type: "github",
        config: {
          owner: "mateossh",
          repoName: "odpady-harmonogram-bp",

          pathIncludes: ["src/*"],
          pathExcludes: ["sst.config.ts"],

          deploymentsEnabled: true,

          productionBranch: "master",
          productionDeploymentsEnabled: true,
        },
      },

      buildConfig: {
        buildCaching: false,
        buildCommand: "bun install && bun run build",
        destinationDir: "dist",
        rootDir: "",
      },

      deploymentConfigs: {
        preview: {
          envVars: {
            SKIP_DEPENDENCY_INSTALL: {
              type: "plain_text",
              value: "TRUE",
            },
            BUN_VERSION: {
              type: "plain_text",
              value: "1.3.6",
            },
          },
        },

        production: {
          envVars: {
            SKIP_DEPENDENCY_INSTALL: {
              type: "plain_text",
              value: "TRUE",
            },
            BUN_VERSION: {
              type: "plain_text",
              value: "1.3.6",
            },
          },
        },
      },
    });

    new cloudflare.DnsRecord("CnameOdpady", {
      zoneId: ZONE_ID,
      name: "odpady.zochow.ski",
      ttl: 1,
      type: "CNAME",
      content: "odpady-harmonogram-bp.pages.dev",
      proxied: true,
    });

    new cloudflare.PagesDomain(
      "PagesDomainOdpady",
      {
        accountId: "b8e5653e747f6ee4b79c9a3050d11ce1",
        projectName: "odpady-harmonogram-bp",
        name: "odpady.zochow.ski",
      },
      {
        dependsOn: [pagesProject],
      },
    );
  },
});

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'zoom-recordings-to-discourse',
    title: 'How to automatically publish Zoom recordings to discourse.org',
    description: 'An automated pipeline using AWS Lambda, Vimeo, and Discourse to publish Zoom cloud recordings with hashtag-based categorization',
    date: '2021-12-22',
    content: `# How to automatically publish Zoom recordings to discourse.org

*Originally published on Medium, December 22, 2021*

While Zoom cloud recordings are easy to make, they are not easily accessible for other people.

We at id5 are using discourse.org within our Intranet to share information and so we want to have each Zoom cloud recording available as a discourse post, where anyone can easily access those recordings.

The solution described in this article is a Zoom cloud recording to Vimeo to discourse.org automated upload and post pipeline.

## Supported features

Any meeting with a hashtag in its title and a Zoom cloud recording should be automatically uploaded to Vimeo and a discourse.org post should be created under the category of its hashtag. Those categories should be sub-categories of "Videos".

### Typical usage in a Google Calendar integration with Zoom

If the meeting title also contains the hashtag #Exp it should be used to set an expiry date when the video and its discourse post will be deleted automatically.

Videos on Vimeo should be password protected.

## AWS architecture

This diagram shows the architecture using AWS infrastructure.

Before we dive into details, let's look at the general building blocks:

- a Zoom cloud API webhook calls an AWS API Gateway for each finished Zoom cloud recording, which puts a message into AWS SNS
- an AWS Lambda function is called for each SNS message, this function downloads the video file, uploads it into Vimeo and finally puts an entry into a AWS DynamoDB table
- A second AWS Lambda function runs every 5 minutes and for each entry in the DynmoDB table it checks if Vimeo has finished the transcoding for this video. When the transcoding is completed, it creates a discourse.org post within a certain category. It might also create a new DynamoDB entry in a second table to set the date and time for an automated deletion of this video and post
- To implement the deletion process, the second AWS Lambda function also checks against the DynamoDB table holding the expiration information. When a video is expired this lambda deletes the video on Vimeo and deletes the post in discourse.org

You might ask why the API Gateway isn't directly connected to a Lambda function. According to this AWS documentation page a lambda connected to an API Gateway cannot have more than 30 seconds of execution time, which might not be enough to download and upload the video. De-coupling the integration gives us a timeout of max 15 minutes.

Now let's look at the different components in detail.

## AWS DynamoDB tables

Start with creating a table \`zoom-to-videoplatform-upload\` and another table \`zoom-to-videoplatform-expiry\`.

Both tables should be of type "On-demand" and have a partition key "videoUrl" of type String.

## AWS API Gateway and SNS

Next create a SNS topic called "zoom-to-vimeo-topic". Then create an API Gateway of type REST called "zoom-to-vimeo-gateway". Create a new resource with a path name of "ingest". Add the POST method with an integration of the SNS service to it. We will add the Auth lambda later.

Create a deployment for it and write down the endpoint URL. I have taken most of the information on how to set up the API Gateway to SNS integration from https://www.alexdebrie.com/posts/aws-api-gateway-service-proxy/, it is worth to read it as well.

## AWS SNS to Lambda

Create a Lambda function using nodejs and attach it via an EventBridge to the SNS, which makes our lambda a subscription of the SNS topic.

The JavaScript code looks like this:

\`\`\`javascript
const AWS = require('aws-sdk');
const stream = require('stream');
const {promisify} = require('util');
const got = require('got');

const pipeline = promisify(stream.pipeline);

const generatePassword = require('./random-password');

AWS.config.update({region: 'eu-central-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const accessToken = '<<here goes the Vimeo API token>>';

const prepareUpload = async (meetingTitle, accessToken, fileSize) => {
    const password = generatePassword();
    const postResponse = await got.post('https://api.vimeo.com/me/videos', {
        json: {
            "upload": {
                "approach":"tus",
                "size": fileSize
            },
            "name": meetingTitle,
            "description": "Video uploaded on: " + new Date(),
            "password": password,
            "privacy": {
                "view": "password"
            }
        },
        responseType: 'json',
        headers: {
            "Authorization": \\\`Bearer \\\${accessToken}\\\`,
            "Accept": "application/vnd.vimeo.*+json;version=3.4"
        }
    });
    const response = postResponse.body;
    return {
        uploadLink: response.upload.upload_link,
        videoUri: response.uri,
        videoFullLink: response.link,
        password: password
    };
}

// Additional functions and handler code...
\`\`\`

You need to make sure to upload the got npm module and a second JavaScript file called "random-password.js" which exports a function to generate a fixed or random password, like:

\`\`\`javascript
const generatePassword = () => {
    return "our-secret-vimeo-password";
}

module.exports = generatePassword
\`\`\`

You have to change the timeout for this lambda to 15 minutes, also you might want to give it more memory.

As this lambda writes into the DynamoDB table "zoom-to-videoplatform-upload", it also needs more permissions. Add this to the existing role:

\`\`\`json
{
  "Effect": "Allow",
  "Action": [
      "dynamodb:PutItem"
  ],
  "Resource": [
      "<<arn of the DynamoDB table zoom-to-videoplatform-upload>>"
  ]
}
\`\`\`

## AWS Authorizer lambda

To protect your API gateway from anybody being able to add Videos to your intranet, you have to implement an Authorizer lambda function.

Create a new lambda, add this code and don't forget to change the token to your Zoom token later on.

\`\`\`javascript
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {};
    return authResponse;
}

exports.handler = async (event) => {
    if (!event.headers || !event.headers.Authorization) {
        throw new Error("Bad Gateway");
    }

    const token = event.headers.Authorization;
    if (token === '<<Your Zoom verification token goes here>>') {
        return generatePolicy('user', 'Allow', event.methodArn);
    }

    throw new Error("Unauthorized");
};
\`\`\`

Add this lambda to the API Gateways Authorizers section. Then go to /ingest POST and under "Method Request" use it as an Authorization.

## The 2nd AWS lambda

As shown in the diagram, this lambda has 2 jobs:

1. looking at the DynamoDB table "zoom-to-videoplatform-upload" and check for any finished transcoding on Vimeo, if so, find the right category on discourse — if this category doesn't exist yet, create it — then post the video on discourse, send a slack notification and delete the entry in "zoom-to-videoplatform-upload"
2. looking at the DynamoDB table "zoom-to-videoplatform-expiry" and for each expired entry, delete the respective Vimeo video and the discourse topic, then delete the entry in "zoom-to-videoplatform-expiry"

To give this Lambda function the needed permission on the DynamoDB tables, add this to the execution role of your Lambda:

\`\`\`json
{
  "Effect": "Allow",
  "Action": [
      "dynamodb:Scan",
      "dynamodb:DeleteItem"
  ],
  "Resource": [
      "<<arn of the DynamoDB table zoom-to-videoplatform-upload>>"
  ]
},
{
    "Effect": "Allow",
    "Action": [
        "dynamodb:Scan",
        "dynamodb:DeleteItem",
        "dynamodb:PutItem"
    ],
    "Resource": [
        "<<arn of the DynamoDB table zoom-to-videoplatform-expiry>>"
    ]
}
\`\`\`

To configure it properly you need to change some values:

\`\`\`javascript
// this is the Vimeo Access token
const accessToken = '<<here goes the Vimeo API token>>';

// this is the Disource.org Access token. Choose "User Level"
// as "All Users" and Scope to "Global"
const discourseToken = {
    user: 'system',
    key: '<<here goes the Discourse API token>>'
}

// this needs to match your discourse.org domain
const discourseRoot = "https://test.trydiscourse.com";

// Create a root category names "Video" and put the id here
const defaultDiscourseCategoryId = 14;
\`\`\`

If you also want a Slack integration you have to add a Webhook integration on one of your channels and replace \`https://hooks.slack.com/services/xxx/xxx/xxxx\` with your endpoint URL.

## Zoom integration

Under https://marketplace.zoom.us/develop/ you need to create a Webhook Only integration.

Enter all relevant data and make sure you have selected the event type "All Recordings have completed".

Make sure to use the endpoint URL you got from the AWS Gateway deployment and put the Verification token into the Authorizer Lambda function.

## Discourse.org configuration

To support embedded Vimeo videos on discourse.org you have to allow iframes from player.vimeo.com. Go to the administration area of discourse and add under Security a new "allowed iframes" entry.

## AWS cost

The AWS cost to run this setup is negligible. We usually pay in the area of 0.01 to 0.1 USD per month for this. All resources are paid by usage which makes them very cheap — of course only as long as you made sure to use On-Demand DynamoDB tables.`
  },
  {
    slug: 'hosting-website-home-fritzbox-ipv6',
    title: 'Hosting a website at home behind a Fritzbox with IPv6 enabled',
    description: 'A guide to hosting a website at home using a Raspberry Pi and Fritzbox with IPv6 support and dynamic DNS',
    date: '2021-05-11',
    content: `# Hosting a website at home behind a Fritzbox with IPv6 enabled

*Originally published on Medium, May 11, 2021*

My "web-server infrastructure" at home is composed of:

- a Fritzbox acting as a DSL modem and a network Router
- a Raspberry Pi as my web-server with Ubuntu 20.04

On this Raspberry Pi I host a few web applications including my homepage. As my home IP changes every night, I use a dynamic DNS service (ydns.eu) as the target for a CNAME on www.oglimmer.de.

As we know hosting a website at home, on a Raspberry Pi for example, is very simple and making it available on the Internet via IPv4 is super straight forward.

## Let us recap the situation for IPv4

1. The browser resolves www.oglimmer.de and finds a CNAME for oglimmer.ydns.eu, which returns an A entry pointing on my Fritzbox's public and dynamic IPv4
2. The Fritzbox forwards a request on port 443 to the Raspberry Pi's web-server, because a port forwarding for 443 to the private and fixed IPv4 of my Raspberry Pi is configured

## Things are more complicated with IPv6

As there is no NAT for IPv6, the Fritzbox does not have a port forwarding, instead it has port permissions on routing configurations. So for my scenario the web-server's IPv6 is given permission to be routed on port 80/443 on incoming requests.

### Here is the problem

My Ubuntu 20.04 assigns two global unicast IPv6 addresses and both of those IPs have randomly generated interface ids.

While this is very good for privacy reasons, this is a problem for my setup, as the Fritzbox needs a static interface id for its routing permission.

## The solution

Enable EUI-64 on the standard address to avoid a randomly generated interface id, that means Ubuntu will use "a MAC address derived" interface id instead.

Where this configuration needs to be applied depends on which component is responsible for SLAAC.

### If SLAAC done by the Kernel

You need to use sysctl to enable EUI-64 via:

\`\`\`
net.ipv6.conf.default.addr_gen_mode = 0
net.ipv6.conf.eth0.addr_gen_mode = 0
\`\`\`

### If SLAAC is done by dhcpcd

You need to change dhcpcd.conf like this:

\`\`\`
slaac hwaddr
\`\`\`

### If SLAAC is done by NetworkManager

You need to change the configuration via:

\`\`\`
nmcli con modify "Connection name" ipv6.addr-gen-mode eui64
\`\`\`

This is my IP setup after applying EUI64. As you can see the MAC address is reflected in the interface id of the second global unicast IPv6 address.

A shout-out needs to go to the user Grawity on qastack.co who pointed us to the right solution. See [this post](https://qastack.co).

## Configuration on the Fritzbox

The Fritzbox has under "Internet" → "Permit access" → "Port sharing" a configuration dialog where you can set sharing options.

Most notably is the setting for "IPv6 Interface ID" which must reflect the MAC address.

## Updating ydns.eu

To complete the process we need a script on the web-server to update the dynamic DNS service with both IPs when my ISP updates my public IP.

A simple cgi-bin is called from the Fritzbox (as a custom dynamic DNS provider):

\`\`\`bash
#!/bin/bash

set -f

echo "Content-type: text/plain; charset=iso-8859-1"
echo

IPV4=$(curl -s ifconfig.me)
curl -u 'user:password' "https://ydns.io/api/v1/update/?host=oglimmer.ydns.eu&record_id=164921&ip=$IPV4"

IPV6=$(ip -6 address show dev enp2s0f0 | grep -v " 0sec" | grep "sec" -B 1 | grep inet | grep -v 'temporary' | grep -v 'inet6 fd' |cut -d ' ' -f6|cut -d '/' -f1)
curl -u 'user:password' "https://ydns.io/api/v1/update/?host=oglimmer.ydns.eu&record_id=173613&ip=$IPV6"
\`\`\`

## Conclusion

Running an IPv6 enabled web-server at home is a bit more complicated than thought, but still pretty doable.

The main problem comes from the fact that enabling EUI-64 on Ubuntu depends on your configuration, but once you understood how it works it's quite straight forward again.`
  },
  {
    slug: 'wsl2-ubuntu-gui-alternative',
    title: 'An alternative development WSL 2 setup with Ubuntu GUI',
    description: 'An alternative approach to setting up WSL 2 with Ubuntu GUI and systemd support without using genie',
    date: '2020-11-16',
    content: `# An alternative development WSL 2 setup with Ubuntu GUI

*Originally published on Medium, November 16, 2020*

You might have seen my last article "A working WSL 2 Ubuntu development setup" which uses a program called "genie" to start systemd on WSL 2.

There is an alternative approach described in [this blog post](https://blog.ubuntu.com/2020/06/17/install-wsl-2-on-windows-10) which I would like to discuss here now.

While that post mainly wants to enable snap on WSL 2, it also brings systemd, thus the goal is very comparable to the approach in my first article.

## Basic installation

So let's start with executing all steps in the linked blog post including the section "/etc/bash.bashrc".

As of this writing, the location of daemonize changed from /usr/sbin to /usr/bin, so I added a sym-link:

\`\`\`bash
ln -s /usr/bin/daemonize /usr/sbin/daemonize
\`\`\`

I also changed the file \`/etc/default/locale\` to:

\`\`\`
LANG=en_US.UTF-8
\`\`\`

and did a "wsl --shutdown" in the Windows PowerShell to make this change effective.

## Installing Gnome

The next step is to install a GUI via:

\`\`\`bash
sudo apt install -y tasksel
sudo tasksel install ubuntu-desktop
\`\`\`

which is similar to my last article.

## X11 Server on Windows

Also see my last article in how to set up and start an X11 Server on Windows. The section "Starting VcXsrv in Windows 10" described the necessary steps.

## Configuration

Add the following lines to the .profile file in your user's home directory:

\`\`\`bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2):0
export NO_AT_BRIDGE=1
unset XDG_RUNTIME_DIR
unset DBUS_SESSION_BUS_ADDRESS
\`\`\`

The first line sets the DISPLAY variable so X11 forwarding to Windows works.

The second line sets a variable to suppress a warning when starting the gnome terminal.

Row three and four are also needed to start gnome terminal. Frankly I don't understand why, I just tried-and-error'ed until it worked, so any explanation is appreciated.

## Fish

As I like to use fish as my Unix shell, I install it via:

\`\`\`bash
sudo apt install -y fish
\`\`\`

but the setup of systemd in this scenario depends on bash, so we keep bash as the standard shell for my user.

Instead I change the default shell just for the gnome-terminal which is my default terminal application anyway.

So start the gnome terminal via:

\`\`\`bash
gnome-terminal
\`\`\`

and go to the preferences dialog and change it to use fish as the default shell.

## Known issues

- I had issues in terms of "WSL can talk properly to Windows", mainly in regards to the Unix sockets in /run/WSL and the shell variable WSL_INTEROP. If those are wrong you cannot use code (aka Visual Studio Code) from WSL anymore, which is obviously very annoying, I often had to set WSL_INTEROP manually

## Conclusion

Generally this approach works as fine as the first one, but the advantages and disadvantages are different.

### Pros:

- You don't have to deal with initializing "genie" and entering those bottles (aka namespaces)

### Cons:

- Still the basic underlying issue of a separated process tree still exists
- The issue around WSL_INTEROP was very severe for me
- Fish is not the default shell — only the gnome-terminal uses it by default`
  },
  {
    slug: 'wsl-dev-setup-endgame',
    title: 'WSL dev setup endgame',
    description: 'The final solution for a WSL development environment using Debian instead of Ubuntu to avoid systemd issues',
    date: '2020-12-22',
    content: `# WSL dev setup endgame

*Originally published on Medium, December 22, 2020*

As my first two articles discussed, I have used Windows 10 with WSL 2 and Ubuntu as my development environment for Java/Node for some time now. But Ubuntu uses the Snap Store to install software so you have to have systemd running. My previous two posts showed two different ways how to set up systemd.

Getting systemd to work comes with price to pay. For all the details read my last 2 articles, but I have to say that the price is too high. So instead of solving all the issues coming from having systemd within WSL, let us try to avoid having those problems.

The main difference for this article is that we are using Debian instead of Ubuntu — as Debian is not using Snap, thus we should not need systemd.

This guide shows step by step what I did to set up a Java/Node development environment with WSL+Debian.

## Windows prerequisites

We need to start with the usual preparations on the Windows side:

Do the basic installation steps for WSL 2 on Windows 10 as described [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

A dev setup without Docker ain't no dev setup ;) so let's install that as well: [Docker for Windows](https://docs.docker.com/docker-for-windows/wsl/)

In my humble opinion Visual Studio Code is generally the best editor in 2020, but when it comes to WSL setups VSC has the unique feature to be able to edit files inside the WSL VM from the Windows side. So I strongly recommend to install it: [Visual Studio Code](https://visualstudio.microsoft.com/)

The next step is to get the Debian distribution from the Microsoft App Store: [Debian](https://www.microsoft.com/en-us/p/debian/9msvkqc78pk6)

I also recommend to install Windows Terminal as it is way better than the default terminal app coming with Windows and especially the possibility to auto-start the gnome-terminal makes it superior. You can install it from the [Microsoft Store](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701)

Finally you need an X11 Server for Windows. I would recommend VcXsrv as it is free and doesn't have any issues: [VcXsrv](https://sourceforge.net/projects/vcxsrv/)

So let us make sure the X Server is running on Windows. Install and start it as described in this article. Keep in mind to change the Windows Firewall!

## Debian setup

If not done yet, start "Debian" from the Windows Start menu once to install it into WSL. Close the application when you see the shell.

Start Windows Terminal and select "Debian" from the profile menu, then execute:

\`\`\`bash
cd $HOME
\`\`\`

to change to your home directory as Windows Terminal starts in the Windows Home directory by default. This is something we can reconfigure later on.

Continue with:

\`\`\`bash
sudo apt update && sudo apt -y upgrade
\`\`\`

to install all available updates.

Let us continue to install some useful packages (at least useful for my type of development):

\`\`\`bash
sudo apt install -y git tasksel net-tools exa openjdk-11-jdk maven gradle wget chromium curl gcc g++ make jq fish meld
\`\`\`

As you see this installs commonly known packages, feel free to add/remove packages to your liking.

This guide assumes you will use fish as your shell.

To set the DISPLAY variable properly, you need to put this into your \`~/.config/fish/config.fish\`:

\`\`\`fish
set -x DISPLAY (cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2):0
\`\`\`

I also needed to explicitly set the PATH variable in my config.fish, but if your PATH variable already looks similar, I would suggest to skip the next step. Make sure to replace \`<WINDOWS_USER>\` with your actual windows user name.

\`\`\`fish
set -x PATH "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files/dotnet/:/mnt/c/Program Files/Docker/Docker/resources/bin:/mnt/c/ProgramData/DockerDesktop/version-bin:/mnt/c/Users/<WINDOWS_USER>/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/<WINDOWS_USER>/AppData/Local/Programs/Microsoft VS Code/bin"
\`\`\`

From this point in time you can use "code" to open Visual Studio Code and of course you can \`code <filename>\` to just edit a file on the Linux filesystem with Visual Studio Code. If this doesn't work, you need to open Visual Studio Code manually and install the plugin "Remote-WSL".

Now we want to install the gnome-desktop to run UI applications:

\`\`\`bash
sudo tasksel install gnome-desktop
\`\`\`

Finally we can change the default shell from bash to fish:

\`\`\`bash
chsh -s /usr/bin/fish
\`\`\`

After closing the current Windows Terminal shell and re-opening one, you should be ready to roll in the fish shell.

You can start with one of these X11 applications:

\`\`\`bash
gnome-terminal
/opt/idea/bin/idea.sh &
chromium &
firefox &
nautilus / &
meld
\`\`\`

## Windows Terminal setup

To make your life easier you can change some configuration. Open the settings for Windows Terminal:

- Add a \`"startingDirectory": "//wsl$/Debian/home/<DEBIAN_USER>"\` to change the initial directory
- You can change the \`defaultProfile\` to Debian's UUID to avoid the first windows always creates a PowerShell
- Add a \`"commandline": "wsl -d Debian -- gnome-terminal && /usr/bin/fish"\` to automatically start the gnome terminal

Example settings:

\`\`\`json
"profiles":
{
    "defaults":
    {
    },
    "list":
    [
        {
            "guid": "{58ad8b0c-3ef8-5f4d-bc6f-13e4c00f2530}",
            "hidden": false,
            "name": "Debian",
            "source": "Windows.Terminal.Wsl",
            "commandline": "wsl -d Debian -- gnome-terminal && /usr/bin/fish",
            "startingDirectory": "//wsl$/Debian/home/oli"
        }
    ]
}
\`\`\`

## VcXsrv setup

You can always start VcXsrv manually, but you can also create a xlaunch file to easily start the X11 Server under Windows with the right configuration. To do so create a file called "x11-startup.xlaunch" at a convenient location under Windows. Add this content:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<XLaunch
    WindowMode="MultiWindow"
    ClientMode="NoClient"
    LocalClient="False"
    Display="-1"
    LocalProgram="xcalc"
    RemoteProgram="xterm"
    RemotePassword=""
    PrivateKey=""
    RemoteHost=""
    RemoteUser=""
    XDMCPHost=""
    XDMCPBroadcast="False"
    XDMCPIndirect="False"
    Clipboard="True"
    ClipboardPrimary="False"
    ExtraParams=""
    Wgl="True"
    DisableAC="True"
    XDMCPTerminate="False"
/>
\`\`\`

Go to \`C:\\Users\\<WINDOWS_USER_NAME>\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\` and create a Windows Shortcuts file here. For maximum convenience go to your Start Menu, right click the new entry "x11-startup" and click "Pin To Start".

## Conclusion

This setup using WSL + X11 + Debian doesn't require solutions for problems you should not have in the first place.

Check out this walk-through video.

I created a script to automate this initial setup for Debian.

Feel free to try it: [https://github.com/oglimmer/wsl-debian-setup](https://github.com/oglimmer/wsl-debian-setup)`
  },
  {
    slug: 'wsl2-ubuntu-development-setup',
    title: 'A working WSL 2 Ubuntu development setup',
    description: 'A comprehensive guide to setting up a development environment using WSL 2, Ubuntu, and Windows tools for the best of both worlds',
    date: '2020-10-26',
    content: `# A working WSL 2 Ubuntu development setup

*Originally published on Medium, October 26, 2020*

## UPDATE: January, 2023

This article was written before Microsoft introduced systemd for WSL as written [here](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/). If available on your system, use the official way instead of genie.

## Introduction

My development setup has two fundamental requirements: the availability of Unix shell scripting and corporate tools/compliance standards.

Furthermore I need a couple of tools and programs and while the required tools vary from project to project, I always want to install IntelliJ IDEA as my Java / JavaScript IDE, Visual Studio Code as my general purpose editor, docker for containers, Microsoft Teams for collaboration, KeePass as a password manager, a terminal application for bash/fish scripting, Meld as a visual diff tool, Postman for testing REST APIs and an assorted choice of browsers, because — you know — browsers are the thing nowadays.

So how can I get that with Windows as the host platform?

## The issue with my setup for the last 12 month

I was working with Ubuntu as my development system for the last 12 month and while I am pretty happy with the setup in general, I had to run it inside a VirtualBox VM to align with corporate compliance regulations.

That again works quite well but there is one serious drawback: memory allocation between the host system and the virtual machine. VirtualBox, as well as VMware, require you to define the available — and the allocated — memory of the virtual machine before you start it.

In situations where you have plenty of memory on the host system and your needs inside the virtual machine are limited, this is no issue at all. Unfortunately my use-case requires a lot of memory inside the VM and on top of that some flexibility for the host system — and that makes the whole setup some sort of a problem.

Originally I wanted to solely use the virtual machine and so I max'ed out the available memory to the guest operating system.

My laptop has 32 GB of RAM and I assigned 24 GB of RAM to the Ubuntu VM. As said the original idea was to start all applications inside the VM to avoid any switching between the host and the VM, but there are things one cannot do (easily) inside a VM and that is for example video conferencing. We use Microsoft Teams which does exist as a (somewhat) native Linux application, but as VirtualBox does not support the camera — at least without commercial addons — I needed to start and use Teams on Windows.

## A possible solution: WSL 2

Microsoft has built a decent native Hypervisor into Windows and with version 2 of WSL (Windows Subsystem for Linux) it supports memory reclaim mechanisms, thus Windows and Ubuntu can increase and decrease their memory distribution at runtime. This feature in combination with Docker Desktop for Windows could make a Windows-HyperV-Ubuntu-X11 setup not only a reality, but it can be superior to a VirtualBox solution.

## The Windows installation

For the sake of reproducibility I have written this article in an tutorial-like style. So if you want to follow along, start with installing Visual Studio Code on Windows.

The first step is to install WSL 2 on Windows as described [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and as we will choose Ubuntu 20.04 as the Linux distribution in a later step, skip step 7. For now you should also install Windows Terminal.

The 2nd step is to install VcXsrv a X11 server for Windows. We will start and configure it later.

The 3rd is to create an Ubuntu VM. So you should download the Ubuntu WSL image from Microsoft Store.

The 4th step on the Windows 10 installation is Docker Desktop for Windows. Just start it after the installation. If the default WSL distro is Ubuntu you don't need to change any settings in Docker. Check the default distro (the asterisk marks the default):

\`\`\`
wsl --list
\`\`\`

If you have or want to have a different default distro, you have to add WSL integration for Ubuntu in the Docker settings dialog under Resources / WSL integration.

The final step is to start Ubuntu via the Start Menu. After initializing the Ubuntu VM in WSL 2 and creating of a user, start with installing the latest Ubuntu updates and switch to the fish shell.

Open the Windows Terminal, then open a "Ubuntu shell" (the little downwards arrow in the menu) and type:

\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y fish
chsh -s /usr/bin/fish
\`\`\`

At this point I would like to point out two arguable decisions I made:

- all my configurations assume fish as the default shell
- I will use remote X11 forwarding to show GUI Linux applications, but you could do that via VNC or RDP as well — it\'s just that I think X11 creates a more homogeneous experience and it completely eradicates multi-monitor issues

Starting a Ubuntu VM with WSL 2 is super simple, but for a real-world usage, there are a couple of issue to overcome.

## Setting up: Visual Studio Code

Inside the Ubuntu shell type

\`\`\`bash
code
\`\`\`
as you see WSL is installing Visual Studio Code in Ubuntu. From now on you can start the Windows Visual Studio Code for editing files on the Linux file system. You might want to read [this](https://code.visualstudio.com/docs/remote/wsl) for a deeper understanding.

## Issue 1: No systemd

The first issue you will find with WSL is that it doesn\'t come with systemd, but many things require systemd, so people created genie.

To install genie und you need a .NET runtime. So we start with installing this:

\`\`\`bash
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-runtime-3.1
\`\`\`

After this you can install genie:

\`\`\`bash
echo "deb [trusted=yes] https://wsl-translinux.arkane-systems.net/apt/ /" | sudo tee /etc/apt/sources.list.d/wsl-translinux.list > /dev/null
sudo apt update
sudo apt install -y systemd-genie
\`\`\`

Now genie — aka systemd — can be started with \`genie -s\`. But before we do this let\'s look into a couple of other issues.

## Issue 2: Changing PATH

Creating a genie shell (via \`genie -s\`) changes the PATH.

\`\`\`bash
echo $PATH
genie -s
echo $PATH
\`\`\`

This is a problem, as the docker and WSL tools (like code) disappeared from the path. Another problem is, that the switch to fish removed the path to \`/snap/bin\`.

My (probably too) simple solution is to set the PATH in the startup script. So type:

\`\`\`bash
code ~/.config/fish/config.fish
\`\`\`

and put the following line into the file (keep in mind to replace "oglimmer" with your Windows user name):

\`\`\fish
set PATH "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files/dotnet/:/mnt/c/Program Files/Docker/Docker/resources/bin:/mnt/c/ProgramData/DockerDesktop/version-bin:/mnt/c/Users/oglimmer/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/oglimmer/AppData/Local/Programs/Microsoft VS Code/bin:/snap/bin"
\`\`\`

## Issue 3: Deleting all content of /tmp

The next issue comes with the temp directory. Start a new Windows Terminal tab for Ubuntu and type:

(To reproduce this, you might need to "wsl --shutdown" first from PowerShell)

\`\`\`bash
ll /tmp
genie -s
ll /tmp
\`\`\`

When genie starts, it somehow deletes everything inside /tmp directory. This is another problem as some programs use /tmp for their state files. An example is ssh-agent which puts its unix socket file into /tmp.

So we need to take that into consideration when starting programs.

## Issue 4: Changing process tree

The next issue comes with the process tree. Start again a new Windows Terminal tab for Ubuntu and type:

(To reproduce this, you might need to "wsl --shutdown" first from PowerShell)

\`\`\`bash
ps -efH
genie -s
ps -efH
\`\`\`

As you see getting into the "systemd aware shell" changes the process tree. Our shell is no longer coming from 3 /init processes, it now has a runuser parent. This has implications on scripts checking for processes. Again we need to keep that in mind.

## Issue 5: Changing host IP for DISPLAY

To start GUI based applications on the remote Windows 10 X Server, the DISPLAY variable has to be defined properly.

Fortunately this is no real issue and we simply put this

\`\`\fish
set -x DISPLAY (cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2):0
\`\`\`

into \`~/.config/fish/config.fish\` (via code).

## Ubuntu GUI preparation

The next step is to install the Ubuntu desktop packages. We do this via tasksel:

\`\`\`bash
sudo apt install -y tasksel
sudo tasksel install ubuntu-desktop
\`\`\`

## Starting VcXsrv in Windows 10

Before we can use any GUI programs in Ubuntu, we have to start the X Server in Windows.

Start VcXsrv via "XLaunch" and confirm the first dialog with next:

Confirm the second dialog with next:

Change "native opengl" to false and "Disable access contrl" to true. Then confirm with next and finally click finsh.

You should now see an X icon in the Windows icon area on the lower right corner. You might need to accept a Firewall change for the "public network".

## The manual daily startup routine :(

We talk about about the Good and the Bad. Now to the Ugly.

Taking the issues from above into account I have to do a couple of manual steps after each start. After opening Windows Terminal and selecting the Ubuntu tab I have to type:

\`\`\`bash
genie -s
eval (ssh-agent -c); set -Ux SSH_AGENT_PID $SSH_AGENT_PID; set -Ux SSH_AUTH_SOCK $SSH_AUTH_SOCK
ssh-add ~/.ssh/id_rsa
gnome-terminal
\`\`\`

If gnome-terminal exits with an error and need to execute a "wsl --shutdown" from PowerShell. Then start the "daily startup routine" again.

At this point I minimize the Windows Terminal and switch to the newly created gnome terminal. The reason for this is that I prefer the select and click behavior of the gnome-terminal, especially with features like X Window selections.

## Docker and Client Certificates

If your company has its own docker registry and authentication is done via client certificates (also called mutual TLS) you need to add a client.key and client.cert (both PEM encoded) into

\`\`\`
C:\\Users\\<username>\\.docker\\certs.d\\docker.mycompany.com
\`\`\`

Unfortunately this is not enough and after each restart of Docker\'s Desktop for Windows application you need to run this command from PowerShell:

\`\`\`powershell
docker run --rm --privileged -d -v /:/host -v $env:UserProfile\\.docker\\certs.d:/certs.d alpine cp -r /certs.d /host/etc/docker/certs.d
\`\`\`

## IntelliJ IDEA

Install it via:

\`\`\`bash
sudo snap install intellij-idea-ultimate --classic
\`\`\`

Start it from the Ubuntu tab in Windows terminal via:

\`\`\`bash
intellij-idea-ultimate &
\`\`\`

## Miscellaneous things to mention

- While memory allocation is flexible, you can limit the max CPU and memory for WSL. This can be configured via .wslconfig
- To have the Windows Terminal as similar as possible to the fish shell, I want to have an alias for "ll" in PowerShell as well:

\`\`\`powershell
cd $env:USERPROFILE\\Documents
md WindowsPowerShell -ErrorAction SilentlyContinue
cd WindowsPowerShell
New-Item Microsoft.PowerShell_profile.ps1 -ItemType "file" -ErrorAction SilentlyContinue
echo "Set-Alias ll ls" > Microsoft.PowerShell_profile.ps1
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
\`\`\`

- Selecting a text in PowerShell should select full paths, so open the Settings and add:

\`\`\`json
"wordDelimiters": " \\\\()\"'-:,;<>~!@#$%^&*|+=[]{}~?│",
\`\`\`

- Using FanzyZone in PowerToys enables you do quickly drop and resize windows into different zones. Very handy for ultra-wide monitors.
- You might want to get familiar with the "wsl" command line tool in PowerShell. This can be used to restart, import or export the Ubuntu VM.

## Running programs in Linux vs. Windows

The setup enables me to run inside Ubuntu:

- IntelliJ IDEA
- gnome-terminal
- meld
- bash/fish scripts
- Firefox, Chrome, Opera

While I can run natively under Windows:

- Visual Studio Code
- Firefox, Chrome, Opera, Edge
- Teams
- KeePass
- Windows Terminal
- Postman

All programs look and behave the same. They all have it\'s own box in the Windows taskbar, can be moved to different monitors and share the Windows Clipboard.

## File system access

You can easily access the Windows file system from Ubuntu via \`/mnt/c/\`. 

Accessing the Ubuntu file system from Windows works as easy as \`\\wsl$\\Ubuntu\\\`

## Docker

You can use docker from Windows and Ubuntu as both share the same docker daemon in the background. Also docker-compose is available by default.

## Known issues

- When docker has strange network issues reboot Windows 10
- Sometimes the Windows 10 X server cannot be reached (e.g. when you want to start gnome-terminal) and you need to shutdown the WSL instances
- Sometimes the docker process holds a handle on directories. This results in a file/directory cannot be written/read within WSL with the error message "file a resource busy". In those cases quit Docker, then delete the directory.
- If starting gnome-terminal doesn\'t work inside a genie bottle, unset DBUS_SESSION_BUS_ADDRESS and XDG_RUNTIME_DIR, still I am unable to create new tabs via " -- tab" while inside a bottle.
- If starting gnome-terminal brings an error "Couldn\'t register with accessibility bus" set NO_AT_BRIDGE to 1.

## Don\'ts

- Do not install Visual Studio Code inside the Ubuntu VM. It has to be used from \`/mnt/c/Users/oglimmer/AppData/Local/Programs/Microsoft VS Code/bin\`
- Do not install docker, docker.io or docker-compose inside the Ubuntu VM. It has to be used from \`/mnt/c/Program Files/Docker/Docker/resources/bin\` or \`/mnt/c/ProgramData/DockerDesktop/version-bin\`

## Conclusion

A dream came true and I got the best of both worlds: the development tools from Linux and the corporate tools from Windows — everything working seamlessly together.

### Pros:

- it mostly feels like one system — and not as two separated operating systems
- you can start Linux GUI applications and they are shown in Windows as a regular window
- the setup is stable and never crashed for me
- memory is handled automatically and without my interaction or attention

### Cons:

- The docker issue around "file and resource is busy" is annoying and forces you into occasional restarts of Docker
- Using remote X11 makes the regular Ubuntu Desktop not available (at least I haven\'t figured it out)
- Using "genie" to start and use systemd creates many problems you usually don\'t have to deal with`
  },
  {
    slug: 'tomee-jpa-datasources',
    title: 'TomEE and JPA DataSources',
    description: 'A guide to the different places DataSources can be defined for web applications using JEE running in a TomEE server',
    date: '2019-06-17',
    content: `# TomEE and JPA DataSources

*Originally published on Medium, June 17, 2019*

This short article shows the different places DataSources can be defined for web applications using JEE running in a TomEE server.

## The situation

In order that your 
@PersistenceContext
 knows against which database it should connect, you have a 
META-INF/persistence.xml
 which defines a persistence-unit which defines a jta-data-source:

### META-INF/persistence.xml

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
        http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
 version="2.2">

   <persistence-unit name="PersUnitName" transaction-type="JTA">
      <jta-data-source>jdbc/mydatabase</jta-data-source>
   </persistence-unit>
</persistence>
\`\`\`

Finally the database connection must be put into JNDI under \`jdbc/mydatabase\` or to be more precise under \`java:comp/env/openejb/Resource/<CONTEXT>/jdbc/mydatabase\`.

## Where DataSources can be defined

In JEE 6 or later DataSources can be defined in:

- a \`<data-source>\` in \`$WEBAPP/WEB-INF/web.xml\` (or application.xml, application-client.xml, ejb-jar.xml)
- a \`@DataSourceDefinition\` in one of your Java classes

Tomcat adds DataSource definitions under some more locations [[1]](https://tomcat.apache.org/tomcat-9.0-doc/jndi-resources-howto.html):

- as a \`<Resource>\` inside \`<GlobalNamingResources>\` in \`$TOMCAT/conf/server.xml\`
- as a \`<Resource>\` inside \`<Context>\` in \`$WEBAPP/META-INF/context.xml\`
- as a \`<Resource>\` inside \`<Context>\` in \`$TOMCAT/conf/Catalina/localhost/mypath.xml\`
- as a \`<Resource>\` inside \`<Context>\` in \`$TOMCAT/conf/server.xml\`

TomEE adds even more DataSource definition locations [[2]](http://tomee.apache.org/datasource-config.html):

- as a \`<Resource>\` inside \`$TOMEE/conf/tomee.xml\`
- as a \`<Resource>\` inside \`$WEBAPP/WEB-INF/resources.xml\`
- as a list of key=value entries in \`$TOMEE/conf/system.properties\`
- as a "-D" command-line option

## The bad news

Defining the \`<Resource>\` at any location in a \`<Context>\` does add a DataSource object into JDNI, but it doesn\'t work for your application - this bug is filed under [https://issues.apache.org/jira/browse/TOMEE-263](https://issues.apache.org/jira/browse/TOMEE-263)

I came up with a (maybe too simple) solution.

## DataSource definitions in some detail

As we have seen DataSources can be defined in various locations, unfortunately they have different formats.

Under \`META-INF/context.xml\` (or any other "context") it looks like:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<Context>
  <Resource name="jdbc/mydatabase" auth="Container"
    type="javax.sql.DataSource" username="root" password=""
    driverClassName="com.mysql.cj.jdbc.Driver"
    url="jdbc:mysql://localhost/myschema" />
</Context>
\`\`\`

While in \`WEB-INF/resources.xml\`:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<tomee>

<Resource id="jdbc/mydatabase" type="DataSource">
   JdbcDriver = com.mysql.cj.jdbc.Driver
   JdbcUrl = jdbc:mysql://localhost/myschema
   UserName = root
</Resource>

</tomee>
\`\`\`

So long story short, make sure you are using the right format at the right place.

## Links

- [[1] Tomcat JNDI Resources How-To](https://tomcat.apache.org/tomcat-9.0-doc/jndi-resources-howto.html)
- [[2] TomEE DataSource Configuration](http://tomee.apache.org/datasource-config.html)
`
  },
  {
    slug: 'poor-mans-continuous-deployment',
    title: 'A poor man\'s Continuous Deployment pipeline',
    description: 'Building a simple CD pipeline with webhooks, cron, and Docker for a cost-effective showcase environment',
    date: '2019-02-07',
    content: `# A poor man's Continuous Deployment pipeline

*Originally published on Medium, February 7, 2019*

In this article I will write about how I built a very simple Continuous Deployment pipeline for my "showcase host". Check out my previous article to read about my Dockerization efforts.

## Why not use a standard CD pipeline?

As some of my projects have private code, I cannot upload build artifacts into public repositories like Maven Central, NPM or Docker-Hub. For cost reasons, I also want to run all projects and their build processes on one host without the need of additional — resource hungry — build or repository applications.

Therefore I came up with my own simple CD workflow.

## Overview

The basic idea was to use a webhook from the git repository to trigger a REST API on my server which in turn triggers a build inside a docker container.

The process is composed of 5 objects:

- **[red]** a 14 lines php web page
- **[orange]** an (empty) filesystem directory
- **[green]** a 2 lines cron.d file
- **[yellow]** a 12 lines bash script
- **[grey]** existing docker-compose.yml files building and re-creating the docker containers

![Process flow overview](/cd-pipeline-flow.png)

## The process flow

1. My github/bitbucket repositories have a webhook configured, which executes on every git commit on the master a GET request to 
https://api.oglimmer.de/v1/push-complete.php?pwd=<password>&target=<name-of-git-repo>

2. The red box is an instance of docker image \`richarvey/nginx-php-fpm\`. This container mounts \`/var/opt/build-queue:/var/opt/build-queue\` and the php script writes a file into this directory for every valid incoming http request.

\`\`\`php
<?php
 if ($_REQUEST['pwd'] == 'PASSWORD') {
  $target = $_REQUEST['target'];
  $allowedTargets = array("cardgameassistance", "cyc", "ggo",
      "http", "junta", "linky", "lunchy", "scg", "toldyouso",
      "yatdg", "citybuilder");
  if (in_array($target, $allowedTargets)) {
   $fp = fopen('/var/opt/build-queue/' . $target, 'w');
   fwrite($fp, $target);
   fclose($fp);
   echo "ok";
  }
 }
?>
\`\`\`

3. The orange box represents a directory, which contains a marker file for every build request coming in through the php script originating from github/bitbucket.

4. The green box is as simple as

\`\`\`*
MAILTO="my-email@address.com"
* * * * * root /usr/local/bin/build-queue-processor.sh
\`\`\`

So the cron daemon will execute the script \`build-queue-processor.sh\` every minute, as we want to trigger a requested deployment — via a file in \`/var/opt/build-queue\` — as soon as possible.

5. The yellow box is the main script called \`build-queue-processor.sh\` and contains the core code of the setup. The script loops over all files in \`/var/opt/build-queue\` and executes a \`docker-compose up -d --build\` on the project given through the file\'s content.

\`\`\`bash
#!/usr/bin/env bash

[ -f /var/opt/build-queue.lock ] && exit 0
touch /var/opt/build-queue.lock

if [ -n "$(ls -A /var/opt/build-queue)" ]; then
 for filename in /var/opt/build-queue/*; do
  content=$(<$filename)
  cd /home/global-install/src/$content
  docker-compose up -d --build
  rm $filename
 done
fi

rm /var/opt/build-queue.lock
\`\`\`

All lines in regards to \`/var/opt/build-queue.lock\` ensure that there are never more than one script executions in parallel.

6. The grey box is the final part of the build pipeline. It\'s a \`docker-compose.yml\` file as the entry point from \`build-queue-processor.sh\`. Like all docker-compose files with a build attribute, my actual build script sits inside a Dockerfile.

While the docker-compose.yml and Dockerfile are not part of my particular CD pipeline, I would like to look at my project GridGameOne [play here] as an example here:

### docker-compose.yml

\`\`\`yaml
version: '2' # Use '2' for Docker Compose file format version
services:
  tomcat:
    build: .
    container_name: ggo-tomcat
    mem_limit: 90M
    ports:
      - 8094:8080
\`\`\`

The docker-compose.yml file is very simple and as mentioned in the last article I limit the memory for all my docker containers to make sure all 20 containers run on my 4GB machine. The exposed port on 8094 is picked up by an haproxy on the host.

### Dockerfile

\`\`\`dockerfile
FROM maven:3-jdk-11-slim as build-env

RUN apt-get -qq update && \
    apt-get -y --no-install-recommends install git && \
    apt-get -y autoremove && \
    apt-get -y autoclean

ADD https://api.github.com/repos/oglimmer/ggo/git/refs/heads/master /tmp/version.json

RUN cd /tmp && \
 git clone https://github.com/oglimmer/ggo.git --single-branch ggo-src && \
 cd ggo-src && \
 export OPENSSL_CONF=/etc/ssl/ && \
 mvn package

FROM oglimmer/adoptopenjdk-tomcat:tomcat9-openjdk11-openj9

COPY --from=build-env /tmp/ggo-src/web/target/grid.war  /usr/local/tomcat/webapps/ROOT.war
\`\`\`

This Dockerfile uses a multi-stage build.

In stage 0 — called \`build-env\` — a maven build is executed after a git repository is cloned. This stage contains a neat trick to work around the docker image cache by adding \`/git/refs/heads/master\` into \`/tmp/version.json\`. So the cache is invalidated when the HEAD of the master branch had changed. No need to use \`--no-cache\`.

The final stage of the Dockerfile just copies the previously built WAR file into it. As mentioned in my last article I use OpenJ9 instead of Oracle\'s Hotspot JVM to minimize the memory usage.

## Build log via email

As the build is executed from the cron daemon, I have \`MAILTO=\"my-email@address.com\"\` on the top of my cron file, so I always get the entire build log output via email.

## Drawbacks

I have noticed two shortcomings:

- Build logs are not archived on the host and just send out via email once
- Build artifacts are not archived / versioned, if my host bursts into flames I need to rebuild everything from source again

## Conclusion

While this approach is certainly not the next industry standard, I would like to conclude that the solution is neither completely bad nor necessarily wrong.

For my use-case of a showcase / demo host it works quite well and it minimizes the operational costs.

The solution is very simple — so just 26 lines of code, an empty directory, a cron entry and Docker container running a php enabled webserver keep my server in sync with all of my github/bitbucket repositories.
`
  },
  {
    slug: 'dockerized-java-nodejs-4gb-ram',
    title: 'How many Dockerized Java and Nodejs applications run on a host with 4GB of RAM?',
    description: 'Exploring how to run 20 Docker containers with Java and Node.js applications on just 4GB of RAM for a cost-effective showcase environment',
    date: '2019-01-30',
    content: `# How many Dockerized Java and Nodejs applications run on a host with 4GB of RAM?

*Originally published on Medium, January 30, 2019*

As said in my previous article, I have written a couple of hobby or prototype projects over the course of the last 15 years. Those are mostly simple web games or things like link or lunch-place management systems. I want to showcase them as cheap as possible.

Those 7 games, 3 management systems and my 'homepages' always ran on a single server. So for years they were deployed on a 2GB host, running as a single Tomcat, a single MySQL, a single CouchDB, a single Apache and two Nodejs processes.

While this was working fine — and quite stable — all applications were deployed too close to each other, they were coupled too tightly and there were version dependencies between all of them.

At the dawn of Containerization I asked myself, how much memory does the host need to run all applications in Docker containers?

**The answer is: just 4GB.**

![Output of docker ps](/docker-ps-output.png)

So the host runs 20 Docker containers in total. But to run so many Docker containers on just 4GB of RAM, all containers need to have restricted memory.

Before we look into details, I would like to point out that this is not a recommendation for a production setup nor a recommendation in terms of how much memory one should assign to Docker containers. This just answers the question, "How many Dockerized Java and Nodejs applications can run on a host with 4GB of RAM" when stability and performance is not a priority. My goal is to run all my showcase applications as cheap as possible inside Docker. That\'s all.

Now let\'s look at the memory limits for the different container types.

## Tomcats

There are 8 Tomcats running and their memory settings go from 70M to 150M. Version 7 and 9 of Tomcat is being used and it seems there are no differences between those versions in terms of memory requirements.

## CouchDBs

The 4 CouchDBs use Version 1.7 and have 200M to 250M of memory assigned. CouchDB recommends way more memory, but this setting works for my showcase. I also noticed that Version 2.x needs more memory, so I decided to stay on 1.7.

## PouchDB

As one system doesn\'t use any fancy feature of CouchDB it can also run on PouchDB with memory limited to 90M.

## Nodejs\'s

The two nodejs containers have 50M respectively 200M max set. Both use version 11 of Nodejs. While Citybuilder uses just a few dependencies and runs with 50M, Linky has many dependencies plus Babel and Webpack and needs 200M to run.

## MySQLs

Both MySQL are Version 5 and memory is limited to 200M or 250M.

## Java processes

Two applications need separate Java backend processes. While one system is set to 150M, the other is set to 350M. Of course those settings highly depend on the process and its nature, so for this article I am just saying Java processes have varying memory needs.

## nginx

The nginx container with support for php is limited to 30M.

## JVM

I always use OpenJ9 instead of Oracle\'s Hotspot JVM. It has a smaller memory footprint which means it runs with less memory.

I tried to run containers with the same memory settings but with Oracle\'s Hotspot but they often get terminated by the OOM-killer. So I have build Tomcat running OpenJ9 images.

## Java Memory Settings

When using Java 8 or 9 you need to set 2 JVM parameters to ensure Java and Docker memory limits are in sync:

\`\`\`
-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap
\`\`\`

## Continuous Delivery Pipeline

As you might have realized a primary goal of my setup is to run everything on one host. Therefore my CD pipeline runs on the same host as well.

I will talk about this in a later article, but for now I would like to mention that for all builds Docker containers are started on this. Those containers don\'t have any memory limit set and (of course) are short lived.

## Additional non-Docker host setup

For the sake of completeness, I would like to say that the host itself is only running an haproxy and postfix. All web-servers, databases or other processes are inside a docker container.

This is how the overall memory situation:

![Output of free](/free-output.png)

## Closing notes

As said this setup is not recommended for a production host with low latency, stability, heavy load or many concurrent users in mind.

But for a showcase environment, with expectations on low operational cost, this is great news and it works better than expected.
`
  },
  {
    slug: 'fulgens-build-deploy-script-generator',
    title: 'Fulgens: a build & local deploy & run script generator',
    description: 'A tool to consistently build, deploy, and run projects locally with support for Docker, Vagrant, and various technologies',
    date: '2019-01-03',
    content: `# Fulgens: a 
build & local deploy & run
 script generator

*Originally published on Medium, January 3, 2019*

![Red panda (Ailurus fulgens)](https://miro.medium.com/max/1400/1*0)

## Motivation

Over the last 15 years I have built a couple of projects (all the stuff on www.oglimmer.de) and while it is very simple to build a Java project via a brain-friendly 'mvn package' it is always a bit cumbersome to start-up a project you haven\'t worked on for quite a while.

Starting a project usually needs a build, a local deployment of the webserver and the database, an initial set up of the database and sometimes a couple of config changes to connect everything together — how this all is done heavily depends on the project and the used technologies.

I wanted to have a system which builds, locally deploys and runs all of my projects with a consistent syntax.

It should be super easy to locally start a project and to play with different versions of Java, Node or database backends. And it should also support Docker and local deployments.

Now this is where Fulgens comes into play.

## Possible solutions with existing technologies

We have maven, gradle, npm and many other standardized build tools to install dependencies and easily build a piece of software. And in my opinion the most important features of these systems are, that you don\'t need any particular knowledge on how to build the software. A build is as easy as 'mvn package' or 'npm install'. So great, the problem how to build an unknown piece of software is already solved.

But how to start the software locally? 'npm start'? Oh wait, it needs a database…. And when it comes to Java you are lost even more. For sure, you could write a maven config to start a database and initialize it, but that gets really ugly, it isn\'t the purpose of maven and thus it is far away from 'easily starting the software locally'.

### But we have provisioning tools like Ansible/Chef/Puppet!

These system tend to have a high complexity, as they have been built to solve a much bigger problem: installing infrastructure — not providing a local setup! Maybe Ansible is easy enough — at least it\'s just an SSH-based remote shell command executor. Still Ansible needs a whole bunch of configuration files and the execution mechanism was made for SSH connections, it\'s again too complex for what we actually want: just a simple local deployment.

### Can\'t Docker spin up environments?

A docker-compose.yml file is well suited to spin up all software components of your project but it doesn\'t change your config files, it\'s not set up your database and most important it doesn\'t give you the flexibility to run your components outside of Docker. So even leaving the last aspect aside, you still need some bash code to cover the missing pieces to (initially) start your project.

## Defining our goals for a new solution

1. We want a single simple description file as the input configuration, a bit like Dockerfile, pom.xml or package.json.
2. We want a (generated) shell script with minimal dependencies that builds, deploys, configures and runs our project.
3. We want support for local builds as well as docker-based build.
4. Different runtime environments should be supported:
   - Downloaded temporary local software
   - Docker
   - Vagrant (VirtualBox)
   - (re-)usage of already installed local software
5. Initial and/or continuous setups in combination with temporary or permanent components should be supported.
6. Last but not least, the generated script should be self-describing, almost zero-knowledge should be needed to run it. Spinning up a working local environment should be as easy as 'mvn package'.

## Introducing Fulgens and the Fulgensfile.js

Let\'s assume we have a Java, web-based project, using a Mysql database.

To start this project, you would probably need to build the java project, start the Mysql database daemon, create a schema, set up some tables and data there and finally deploy the generated war file into a Tomcat server while adding a configuration file.

Let\'s write a Fulgensfile.js to describe the project:

\`\`\`javascript
module.exports = {
  config: {
    SchemaVersion: "1.0.0",
    Name: "JavaWebProjectExample"
  },
  software: {
    javaCode: {
      Source: "mvn",
      Artifact: "target/JavaWebProjectExample.war"
    },
    tomcat: {
      Source: "tomcat",
      Deploy: "javaCode"
    }
  }
}
\`\`\`

This is a minimal length Fulgensfile.js for a Java, web-based project as it describes how the Java code should be build and where the generated artifact can be found on the filesystem.

It also defines a Tomcat web server and connects the result of the first step into the Servlet container.

Let\'s add a database:

\`\`\`javascript
...
  software: {
    javaCode: {
      Source: "mvn",
      Artifact: "target/JavaWebProjectExample.war"
    },
    mysql: {
      Source: "mysql",
      Mysql: {
        Schema: "java_code",
        Create: [ "./src/db/mysql.dump" ]
      }
    },
    tomcat: {
      Source: "tomcat",
      Deploy: "javaCode"
    }
  }
...
\`\`\`

The new object "mysql" in the Fulgensfile.js will start a Mysql instance inside Docker, it will create a schema 'java_code' and import the sql file ./src/db/mysql.dump.

There is still one problem, the JavaCode.war doesn\'t know how to find the Mysql host if it is not 'localhost'.

\`\`\`javascript
...
software: {
  javaCode: {
    Source: "mvn",
    Artifact: "target/JavaWebProjectExample.war",
    configFile: {
      Name: "java.properties",
      Content: [{
        Source:"mysql",
        Regexp: ".*db.host.*",
        Line: \"db.host\": \"$VALUE$\""
      }],
      LoadDefaultContent: "src/main/resources/default.properties",
      AttachAsEnvVar: [
        "JAVA_OPTS", "-Dconfig.properties=$SELF_NAME$"
      ]
    }
  },
  mysql: {
    Source: "mysql",
    Mysql: {
      Schema: "java_code",
      Create: [ "./src/db/mysql.dump" ]
    }
  },
  tomcat: {
    Source: "tomcat",
    Deploy: "javaCode"
    }
  }
...
\`\`\`

The final piece defines a configuration file for our WAR. It specifies the db.host variable and assigns the mysql host name to it. Finally the file name will be assigned to a -D parameter called config.properties via the tomcat environment variable JAVA_OPTS.

To support Vagrant the Fulgensfile.js needs a section 'Vagrant' on the initial config object:

\`\`\`javascript
module.exports = {
  config: {
    SchemaVersion: "1.0.0",
    Name: "JavaWebProjectExample",
    Vagrant: {
      Box: 'ubuntu/xenial64',
      Install: 'maven openjdk-8-jdk-headless mysql-client-5.7 docker.io'
    }
  },
...
}
\`\`\`

This defines the packages needed on a fresh installation of Ubuntu 16.04.

## Generating the bash script

After installing Fulgens from the npm repository via \`npm -g install fulgens\`, a bash script can be generated using the command:

\`\`\`bash
fulgens Fulgensfile.js >run_local.sh
\`\`\`

(You need to give the generated bash script executable rights via \`chmod 755 run_local.sh\`)

The script can be started with \`-h\` to get the help information.

![Fulgens help output](/fulgens-help.jpeg)

## Executing the script to build, deploy and run the project

One of the most simple things one can do with the script is to start it via \`./run_local.sh -f\`. This will build the WAR file, start the Mysql database, set up the schema, table and initial data and finally start a Tomcat with the deployed WAR file. As we have given -f the script will finally tail Tomcat\'s log file.

If we want to start the Tomcat inside a Docker container, we use \`./run_local.sh -t tomcat:docker\`. This still builds the WAR file, starts the Mysql database, sets up the schema, table and initial data and finally starts a Tomcat within Docker with the deployed WAR file.

The build can also be done inside a Docker container. \`./run_local.sh -t javacode:docker\`. This will again build, deploy and start the project. But this time the maven build, called 'javacode', will be executed inside Docker.

To build, deploy and start the project inside a Vagrant (VirtualBox) environment, you can use \`./run_local.sh -V\`.

## Documenting and limiting versions

Fulgens can also be used to document and limit software versions.

Let\'s assume our project must be build with Java 1.8, the Mysql must be a Version 5.x and the Tomcat a 7.0.92 using JRE-8.

In this case a versions object can be added to the Fulgensfile.js:

\`\`\`javascript
...
versions: {
  javaCode: {
    Docker: "3-jdk-8",
    JavaLocal: "1.8",
    KnownMax: "Java 1.8"
  },
  mysql: {
    Docker: "5",
    KnownMax: "Mysql 5.x"
  },
  tomcat: {
    Docker: "7.0.92-jre8-slim",
    TestedWith: "7 on Java 8"
  }
}
...
\`\`\`

The attributes \`KnownMax\` and \`TestedWith\` are for documentation only and can hold any string. The attributes \`Docker\` and \`JavaLocal\` are actually limiting the Docker or Java versions used by Fulgens.

## Real world references

Here are some examples where I used Fulgens for my own projects:

- **Code Your Restaurant (cyc)**: Builds a Java project, starts a Couchdb with 3 views. The project consists of 2 parts: a backend server (plain Java) and a WAR file hosted on Tomcat. Both need config files.

- **Lunchy**: A Java web application using Mysql. Builds the Java project, starts Mysql, deploys the WAR file to Tomcat. Uses utf-8 config for Mysql, creates schema, tables and initial data.

- **Told You So**: Uses a different pom.xml for Java >= 9. Starts CouchDB and Tomcat.

- **Linky**: Clones Lucene git repository, builds it and starts it as a standalone Java process. Then starts CouchDB with 2 schemas and initial views. Finally starts a Node program with config files and environment variables.

- **Citybuilder**: Node.js project with CouchDB backend.

- **Grid Game One (ggo)**: Simple build and Tomcat deployment.

## Limitations

This project is in an early development stage and all features correlate strongly with what I needed for my projects. Further enhancements and extensions will depend on feedback from other users.

Currently Fulgens supports:

- maven (to build)
- java (to start)
- node (to start)
- shell script (to start)
- tomcat (to host war files)
- mysql (as a database backend)
- couchdb (as a database backend)
- redis (as a database backend)

---

*Check out the project on [GitHub](https://github.com/oglimmer/fulgens) and [npm](http://npmjs.com/package/fulgens).*`
  }
]
